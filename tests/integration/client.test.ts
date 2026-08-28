import { TCG_PLAYER_CATEGORY_ID, TCGCSVClient } from '../../src';

describe('Client', () => {
  const POKEMON_CROWN_ZENITH_GALARIAN_GALLERY_GROUP_ID = 17689;
  let client: TCGCSVClient;

  beforeEach(() => {
    client = new TCGCSVClient({ userAgent: 'TCGCSV-Client-Integration-Tests/1.0' });
  });

  describe('getCategories', () => {
    test('Returns a list of categories', async () => {
      const categories = await client.getCategories();

      expect(categories).toStrictEqual({
        success: true,
        errors: [],
        totalItems: expect.any(Number),
        results: expect.arrayContaining([
          expect.objectContaining({
            categoryId: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      });
    });
  });

  describe('getGroups', () => {
    test('Returns a list of categories', async () => {
      const groups = await client.getGroups(TCG_PLAYER_CATEGORY_ID.POKEMON);

      expect(groups).toStrictEqual({
        success: true,
        errors: [],
        totalItems: expect.any(Number),
        results: expect.arrayContaining([
          expect.objectContaining({
            groupId: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      });
    });
  });

  describe('getProducts', () => {
    test('Returns a list of products', async () => {
      const products = await client.getProducts(
        TCG_PLAYER_CATEGORY_ID.POKEMON,
        POKEMON_CROWN_ZENITH_GALARIAN_GALLERY_GROUP_ID // SWSH: Crown Zenith: Galarian Gallery
      );

      expect(products).toStrictEqual({
        success: true,
        errors: [],
        totalItems: expect.any(Number),
        results: expect.arrayContaining([
          expect.objectContaining({
            productId: expect.any(Number),
            name: expect.any(String),
          }),
        ]),
      });
    });
  });

  describe('getProductPrices', () => {
    test('Returns a list of product prices', async () => {
      const prices = await client.getProductPrices(
        TCG_PLAYER_CATEGORY_ID.POKEMON,
        POKEMON_CROWN_ZENITH_GALARIAN_GALLERY_GROUP_ID
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
  });

  describe('getHistoricalProductPrices', () => {
    test('Returns a 7z stream which can be decompressed to extract prices', async () => {
      const historicalPrices = await client.getHistoricalProductPrices('2025-01-01');
      const prices = await historicalPrices.getPrices(
        TCG_PLAYER_CATEGORY_ID.POKEMON,
        POKEMON_CROWN_ZENITH_GALARIAN_GALLERY_GROUP_ID
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
  });

  describe('getLastUpdated', () => {
    test('Returns the date the prices were last updated', async () => {
      const lastUpdated = await client.getLastUpdated();
      expect(lastUpdated).toStrictEqual(expect.any(Date));
    });
  });
});
