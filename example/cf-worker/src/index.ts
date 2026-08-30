import { TCGCSVClient, HTTPError, ValidationError } from '@tcgdata/tcgcsv-client';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createMiddleware } from 'hono/factory';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { HistoricalProductPrices } from '../../../src';

type AppEnv = {
  Bindings: Env;
};

export class Proxy extends WorkerEntrypoint<Env> {
  private app: Hono<AppEnv>;

  public constructor(ctx: ExecutionContext, env: Env) {
    super(ctx, env);

    const cacheMiddleware = createMiddleware(async (c, next) => {
      await next();

      // Don't cache errors
      if (c.res.status >= 500) {
        return;
      }

      // Don't override explicit cache header
      if (c.res.headers.get('cache-control')) {
        return;
      }

      c.res.headers.set('cache-control', 'public, max-age=300, stale-if-error=86400');
    });

    const app = new Hono<AppEnv>();
    const client = new TCGCSVClient({
      userAgent: 'TCGCSV-CF-Proxy/1.0',
    });

    app.use('*', cacheMiddleware);
    app.onError((error, c) => {
      if (error instanceof HTTPException) {
        return c.json({ message: error.message }, error.status);
      } else if (error instanceof ValidationError) {
        return c.json({ message: error.message }, 400);
      } else if (error instanceof HTTPError) {
        return error.response ? error.response : c.json({ message: error.message }, 500);
      }

      return c.json({ message: 'Internal Server Error' }, 500);
    });

    app.get('/tcgplayer/categories', async (c) => {
      return c.json(await client.getCategories());
    });

    app.get('/tcgplayer/:categoryId/groups', async (c) => {
      return c.json(await client.getGroups(Number(c.req.param('categoryId'))));
    });

    app.get('/tcgplayer/:categoryId/:groupId/products', async (c) => {
      return c.json(
        await client.getProducts(Number(c.req.param('categoryId')), Number(c.req.param('groupId')))
      );
    });

    app.get('/tcgplayer/:categoryId/:groupId/prices', async (c) => {
      return c.json(
        await client.getProductPrices(
          Number(c.req.param('categoryId')),
          Number(c.req.param('groupId'))
        )
      );
    });

    app.get('/archive/tcgplayer/:archiveName', async (c) => {
      const archiveName = c.req.param('archiveName');
      const matches = archiveName.match(/^prices-(?<date>.+?)\.ppmd\.7z$/);

      if (matches?.groups?.date) {
        const result = await client.getHistoricalProductPricesArchive(matches.groups.date);

        return new Response(result.archive, {
          headers: {
            'content-type': 'application/octet-stream',
            'content-disposition': `attachment; filename="${result.fileName}"`,
            // If we successfully got historical prices they shouldn't ever change, cache for a long time.
            'cache-control': 'public, max-age=86400, stale-if-error=86400',
          },
        });
      }
    });

    app.get('/last-updated.txt', async (c) => {
      return c.text((await client.getLastUpdated()).toISOString());
    });

    this.app = app;
  }

  public async fetch(request: Request): Promise<Response> {
    return this.app.fetch(request, this.env, this.ctx);
  }
}

export class ArchiveExtractor extends WorkerEntrypoint<Env> {
  private app: Hono<AppEnv>;

  public constructor(ctx: ExecutionContext, env: Env) {
    super(ctx, env);

    const app = new Hono<AppEnv>();

    // IMPORTANT: This is not recommended for serving historical prices to users. It is slow and compute expensive.
    // This serves the purpose of demonstrating that a CF worker can decompress the archive contents.
    app.get('/archive/tcgplayer/:date/:categoryId/:groupId/prices', async (c) => {
      const { date, categoryId, groupId } = c.req.param();
      const response: Response = await this.ctx.exports.Proxy.fetch(
        new URL(`/archive/tcgplayer/prices-${date}.ppmd.7z`, c.req.url)
      );

      if (response.status !== 200) {
        return response;
      }

      const historicalProductPrices = new HistoricalProductPrices(date, await response.bytes());
      const headers: Record<string, string> = {};
      const cacheControl = response.headers.get('cache-control');

      if (cacheControl) {
        headers['cache-control'] = cacheControl;
      }

      return c.json(await historicalProductPrices.getPrices(Number(categoryId), Number(groupId)), {
        headers,
      });
    });

    this.app = app;
  }

  public async fetch(request: Request): Promise<Response> {
    return this.app.fetch(request, this.env, this.ctx);
  }
}

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/archive/tcgplayer') && url.pathname.endsWith('/prices')) {
      return ctx.exports.ArchiveExtractor.fetch(request);
    }

    return ctx.exports.Proxy.fetch(request);
  },
} satisfies ExportedHandler<Env>;
