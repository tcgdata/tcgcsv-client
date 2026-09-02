import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { faker } from '@faker-js/faker';
import { TCGCSVClient } from './TCGCSVClient';

describe('TCGCSVClient', () => {
  const server = setupServer();
  let userAgent: string;
  let client: TCGCSVClient;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    userAgent = faker.internet.userAgent();
    client = new TCGCSVClient({ userAgent });
    server.resetHandlers();
  });

  describe('Common behaviour', () => {
    test('Attaches customer user agent header to request', async () => {
      let requestUserAgent: string | null = null;
      const expectedResult = {
        success: true,
        errors: [],
        results: [],
      };

      server.use(
        http.get('https://tcgcsv.com/tcgplayer/categories', ({ request }) => {
          requestUserAgent = request.headers.get('user-agent');
          return HttpResponse.json(expectedResult);
        })
      );

      await client.getCategories();
      expect(requestUserAgent).toBe(userAgent);
    });

    test('Throws if a non-success response status is returned', async () => {
      const error = faker.lorem.words();

      server.use(
        http.get('https://tcgcsv.com/tcgplayer/categories', () =>
          HttpResponse.text(error, { status: 500 })
        )
      );

      await expect(client.getCategories()).rejects.toThrow(
        `Failed to fetch "https://tcgcsv.com/tcgplayer/categories", received status 500: ${error}`
      );
    });
  });

  describe('getCategories', () => {
    test('Returns a list of categories', async () => {
      const expectedResult = {
        success: true,
        errors: [],
        results: [
          {
            categoryId: faker.number.int(),
            name: faker.lorem.words(),
            modifiedOn: faker.date.past().toISOString(),
            displayName: faker.lorem.words(),
            seoCategoryName: faker.lorem.words(),
            categoryDescription: faker.lorem.words(),
            categoryPageTitle: faker.lorem.words(),
            sealedLabel: faker.lorem.words(),
            nonSealedLabel: faker.lorem.words(),
            conditionGuideUrl: faker.internet.url(),
            isScannable: faker.datatype.boolean(),
            popularity: faker.number.int(),
            isDirect: faker.datatype.boolean(),
          },
        ],
      };

      server.use(
        http.get('https://tcgcsv.com/tcgplayer/categories', () => HttpResponse.json(expectedResult))
      );

      const categories = await client.getCategories();
      expect(categories).toStrictEqual(expectedResult);
    });
  });

  describe('getGroups', () => {
    test('Returns a list of groups', async () => {
      const categoryId = faker.number.int();
      const expectedResult = {
        success: true,
        errors: [],
        results: [
          {
            groupId: faker.number.int(),
            name: faker.lorem.words(),
            abbreviation: faker.lorem.word(),
            isSupplemental: faker.datatype.boolean(),
            publishedOn: faker.date.past().toISOString(),
            modifiedOn: faker.date.past().toISOString(),
          },
        ],
      };

      server.use(
        http.get(`https://tcgcsv.com/tcgplayer/${categoryId}/groups`, () =>
          HttpResponse.json(expectedResult)
        )
      );

      const groups = await client.getGroups(categoryId);
      expect(groups).toStrictEqual(expectedResult);
    });

    test('Throws if attempting to query a non-integer category', async () => {
      // @ts-expect-error Testing bad input
      await expect(client.getGroups('not/a/number')).rejects.toThrow(
        'Category "not/a/number" is invalid, must be a positive integer.'
      );
    });
  });

  describe('getProducts', () => {
    test('Returns a list of products', async () => {
      const categoryId = faker.number.int();
      const groupId = faker.number.int();
      const expectedResult = {
        success: true,
        errors: [],
        results: [
          {
            productId: faker.number.int(),
            name: faker.lorem.words(),
            cleanName: faker.lorem.words(),
            imageUrl: faker.lorem.words(),
            categoryId: faker.number.int(),
            groupId: faker.number.int(),
            url: faker.internet.url(),
            modifiedOn: faker.date.past().toISOString(),
            imageCount: faker.number.int(),
            presaleInfo: {
              isPresale: faker.datatype.boolean(),
              releasedOn: faker.date.past().toISOString(),
              note: faker.lorem.words(),
            },
            extendedData: [
              {
                name: faker.lorem.words(),
                displayName: faker.lorem.words(),
                value: faker.lorem.words(),
              },
            ],
          },
        ],
      };

      server.use(
        http.get(`https://tcgcsv.com/tcgplayer/${categoryId}/${groupId}/products`, () =>
          HttpResponse.json(expectedResult)
        )
      );

      const products = await client.getProducts(categoryId, groupId);
      expect(products).toStrictEqual(expectedResult);
    });

    test('Throws if attempting to query a non-integer group', async () => {
      // @ts-expect-error Testing bad input
      await expect(client.getProducts('not/a/number')).rejects.toThrow(
        'Category "not/a/number" is invalid, must be a positive integer.'
      );
    });

    test('Throws if attempting to query a non-integer category', async () => {
      // @ts-expect-error Testing bad input
      await expect(client.getProducts(faker.number.int(), 'not/a/number')).rejects.toThrow(
        'Group "not/a/number" is invalid, must be a positive integer.'
      );
    });
  });

  describe('getProductPrices', () => {
    test('Returns a list of product prices', async () => {
      const categoryId = faker.number.int();
      const groupId = faker.number.int();
      const expectedResult = {
        success: true,
        errors: [],
        results: [
          {
            productId: faker.number.int(),
            lowPrice: faker.number.float(),
            midPrice: faker.number.float(),
            highPrice: faker.number.float(),
            marketPrice: faker.number.float(),
            directLowPrice: faker.number.float(),
            subTypeName: faker.lorem.words(),
          },
        ],
      };

      server.use(
        http.get(`https://tcgcsv.com/tcgplayer/${categoryId}/${groupId}/prices`, () =>
          HttpResponse.json(expectedResult)
        )
      );

      const prices = await client.getProductPrices(categoryId, groupId);
      expect(prices).toStrictEqual(expectedResult);
    });

    test('Throws if attempting to query a non-integer group', async () => {
      // @ts-expect-error Testing bad input
      await expect(client.getProductPrices('not/a/number')).rejects.toThrow(
        'Category "not/a/number" is invalid, must be a positive integer.'
      );
    });

    test('Throws if attempting to query a non-integer category', async () => {
      // @ts-expect-error Testing bad input
      await expect(client.getProductPrices(faker.number.int(), 'not/a/number')).rejects.toThrow(
        'Group "not/a/number" is invalid, must be a positive integer.'
      );
    });
  });

  describe('getHistoricalProductPricesArchive', () => {
    test('Returns a stream with the historical prices archive', async () => {
      const date = '2026-07-01';
      const archive = await fs.readFile(
        path.resolve(import.meta.dirname, '..', 'model', 'fixtures', `prices-${date}.ppmd.7z`)
      );
      const archiveArray = new Uint8Array(archive.buffer, archive.byteOffset, archive.byteLength);

      server.use(
        http.get(`https://tcgcsv.com/archive/tcgplayer/prices-${date}.ppmd.7z`, () =>
          HttpResponse.arrayBuffer(archiveArray.buffer)
        )
      );

      const result = await client.getHistoricalProductPricesArchive(date);
      expect(result).toStrictEqual({
        archive: expect.any(ReadableStream),
        date,
        fileName: 'prices-2026-07-01.ppmd.7z',
      });
    });
  });

  describe('getLastUpdated', () => {
    test('Returns the date the data was last updated', async () => {
      const expectedLastUpdated = faker.date.past();

      server.use(
        http.get(`https://tcgcsv.com/last-updated.txt`, () =>
          HttpResponse.text(expectedLastUpdated.toISOString())
        )
      );

      expect(await client.getLastUpdated()).toStrictEqual(expectedLastUpdated);
    });

    test.each([
      ['no content', ''],
      ['non date response', faker.lorem.words()],
    ])('Throws if %s is returned', async (_: string, responseBody) => {
      server.use(
        http.get(`https://tcgcsv.com/last-updated.txt`, () => HttpResponse.text(responseBody))
      );

      await expect(client.getLastUpdated()).rejects.toThrow(
        `Invalid last updated time "${responseBody}" returned from TCGCSV.`
      );
    });
  });
});
