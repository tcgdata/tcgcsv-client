import * as fsp from 'node:fs/promises';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Readable } from 'node:stream';
import { faker } from '@faker-js/faker';
import { HistoricalProductPrices } from './HistoricalProductPrices';
import { TCG_PLAYER_CATEGORY_ID } from '../constants';
import { HistoricalProductPricesBulkGetPricesResult } from './HistoricalProductPrices.types';

describe('HistoricalProductPrices', () => {
  const POKEMON_AQUAPOLIS_GROUP_ID = 1397;
  const POKEMON_CROWN_ZENITH_GROUP_ID = 17688;
  const POKEMON_CROWN_ZENITH_GG_GROUP_ID = 17689;
  const INVALID_GROUP_ID = 999999;

  let model: HistoricalProductPrices;

  beforeEach(async () => {
    const archive = await fsp.readFile(
      path.join(import.meta.dirname, 'fixtures/prices-2026-07-01.ppmd.7z')
    );

    model = await HistoricalProductPrices.create(archive, '2026-07-01');
  });

  describe('getPrices', () => {
    test('Returns prices for a group', async () => {
      const prices = await model.getPrices(
        TCG_PLAYER_CATEGORY_ID.POKEMON,
        POKEMON_AQUAPOLIS_GROUP_ID
      );

      expect(prices).toStrictEqual({
        success: true,
        errors: [],
        results: expect.arrayContaining([
          expect.objectContaining({
            productId: expect.any(Number),
            marketPrice: expect.any(Number),
          }),
        ]),
      });
    });

    test('Throws if an non-existent category/group ID is provided', async () => {
      await expect(
        model.getPrices(TCG_PLAYER_CATEGORY_ID.POKEMON, INVALID_GROUP_ID)
      ).rejects.toThrow(
        `Prices do not exist for group "${INVALID_GROUP_ID}" in category "${TCG_PLAYER_CATEGORY_ID.POKEMON}".`
      );
    });
  });

  describe('getGroups', () => {
    test('Returns the list of group and category IDs', async () => {
      expect(await model.getGroups()).toStrictEqual(
        expect.arrayContaining([
          {
            categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
            groupId: POKEMON_AQUAPOLIS_GROUP_ID,
          },
        ])
      );
    });
  });

  describe('bulkGetPrices', () => {
    test('Returns an async iterator with the prices for the requested product groups', async () => {
      const result: Array<HistoricalProductPricesBulkGetPricesResult> = [];
      const generator = model.bulkGetPrices({
        groups: [
          {
            categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
            groupId: POKEMON_CROWN_ZENITH_GROUP_ID,
          },
          {
            categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
            groupId: POKEMON_CROWN_ZENITH_GG_GROUP_ID,
          },
        ],
      });

      for await (const item of generator) {
        result.push(item);
      }

      expect(result).toStrictEqual([
        {
          categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
          groupId: POKEMON_CROWN_ZENITH_GROUP_ID,
          prices: expect.objectContaining({
            results: expect.arrayContaining([
              expect.objectContaining({
                productId: 478173, // Mewtwo 059/159
                subTypeName: 'Holofoil',
                marketPrice: expect.anything(),
              }),
              expect.objectContaining({
                productId: 478173, // Mewtwo 059/159
                subTypeName: 'Reverse Holofoil',
                marketPrice: expect.anything(),
              }),
            ]),
          }),
        },
        {
          categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
          groupId: POKEMON_CROWN_ZENITH_GG_GROUP_ID,
          prices: expect.objectContaining({
            results: expect.arrayContaining([
              expect.objectContaining({
                productId: 477057, // Mewtwo VSTAR GG44
                subTypeName: 'Holofoil',
                marketPrice: expect.anything(),
              }),
            ]),
          }),
        },
      ]);
    });

    test('Returns undefined prices for if an invalid category/group ID combiantion is requested', async () => {
      const result: Array<HistoricalProductPricesBulkGetPricesResult> = [];
      const generator = model.bulkGetPrices({
        groups: [
          {
            categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
            groupId: INVALID_GROUP_ID,
          },
        ],
      });

      for await (const item of generator) {
        result.push(item);
      }

      expect(result).toStrictEqual([
        {
          categoryId: TCG_PLAYER_CATEGORY_ID.POKEMON,
          groupId: INVALID_GROUP_ID,
          prices: undefined,
        },
      ]);
    });

    test('Can load all prices', { timeout: 30_000 }, async () => {
      const groups = await model.getGroups();
      const result: Array<HistoricalProductPricesBulkGetPricesResult> = [];
      const generator = await model.bulkGetPrices({ groups });

      for await (const item of generator) {
        result.push(item);
      }

      expect(result.length).toBe(groups.length);
    });

    test('Throws if invalid category ID provided', async () => {
      const categoryId = faker.lorem.words();
      const groupId = faker.number.int();

      // @ts-expect-error Testing bad inputs
      const generator = model.bulkGetPrices({ groups: [{ groupId, categoryId }] });
      await expect(generator.next()).rejects.toThrow(
        `Category "${categoryId}" is invalid, must be a positive integer.`
      );
    });

    test('Throws if invalid group ID provided', async () => {
      const categoryId = faker.number.int();
      const groupId = faker.lorem.words();

      // @ts-expect-error Testing bad inputs
      const generator = model.bulkGetPrices({ groups: [{ groupId, categoryId }] });
      await expect(generator.next()).rejects.toThrow(
        `Group "${groupId}" is invalid, must be a positive integer.`
      );
    });
  });

  describe('create', () => {
    test('Create from response stream', async () => {
      const date = '2026-07-01';
      const stream = Readable.toWeb(
        fs.createReadStream(path.resolve(import.meta.dirname, 'fixtures', `prices-${date}.ppmd.7z`))
      ) as ReadableStream;

      const allPrices = await HistoricalProductPrices.create(stream, date);
      const prices = await allPrices.getPrices(TCG_PLAYER_CATEGORY_ID.POKEMON, 604); // Base Set
      expect(prices).toStrictEqual({
        success: true,
        errors: [],
        results: expect.arrayContaining([
          {
            directLowPrice: 685.49,
            highPrice: 1500,
            lowPrice: 534.99,
            marketPrice: 694.08,
            midPrice: 700.52,
            productId: 42382,
            subTypeName: 'Holofoil',
          },
        ]),
      });
    });
  });
});
