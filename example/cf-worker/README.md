# tcgcsv-proxy

Demonstrates a CF worker proxying data from TCGCSV using `@tcgdata/tcgcsv-client`

The following endpoints are exposed by the worker and pseudo-proxy to the same path on [TCGCSV](https://tcgcsv.com/).
They additionally use [CF worker cache](https://developers.cloudflare.com/workers/cache/), mostly with short TTL to
short-circuit recently proxied requests:

- `GET /tcgplayer/categories`
- `GET /tcgplayer/:categoryId/groups`
- `GET /tcgplayer/:categoryId/:groupId/products`
- `GET /tcgplayer/:categoryId/:groupId/prices`
- `GET /archive/tcgplayer/:archiveName`
- `GET /last-updated.txt`

Additionally, the following endpoint proxies to `GET /archive/tcgplayer/:archiveName` and then uses
[7z-wasm](https://github.com/use-strict/7z-wasm) to decompress the returned archive and return the historical prices
of a single TCGplayer group:

- `GET /archive/tcgplayer/:date/:categoryId/:groupId/prices`

Doing decompression in a product endpoint is not recommended due to high latency and compute cost. This serves
purely as an example and would be better adopted for a process which decompresses the data and ingests into a DB or
other data storage.

## Deployment instructions

1. Install/configure Wrangler: https://developers.cloudflare.com/workers/wrangler/install-and-update/
2. Install and build tcgcsv-client: `cd tcgcsv-client-directory && npm i && npm run build`
3. Install and prepare the worker dependencies: `cd example/cf-worker && npm i && npm run cf-typegen`
4. Deploy the worker: `npm run deploy`
5. Go to the worker domain: `https://tcgcsv-proxy.[your-worker-domain].workers.dev/en/series`
