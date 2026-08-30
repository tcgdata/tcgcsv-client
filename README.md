# @tcgdata/tcgcsv-client

![NPM Version](https://img.shields.io/npm/v/%40tcgdata%2Ftcgcsv-client)
![CI](https://github.com/tcgdata/tcgcsv-client/actions/workflows/ci.yml/badge.svg)

A strongly typed JS client library for fetching data from https://tcgcsv.com/

This library is not affiliated or endorsed by CptSpaceToaster (the maintainer of TCGCSV) or TCGplayer.

## Requirements

- Historical prices are compressed in 7z format. [7z-wasm](https://github.com/use-strict/7z-wasm/tree/master) is used
  to decompress these. You need to ensure the wasm is bundled/can be loaded if fetching historical data.

## Notes

- Rate limits apply, refer to [TCGCSV docs](https://tcgcsv.com/docs) for recommendations and best practices.
- Data is updated daily around 20:00:00 UTC, [per homepage](https://tcgcsv.com/).
- Historical prices are available [starting from 2024-02-08 onwards](https://tcgcsv.com/faq#price-archive).
- If scraping all data it is recommended to [skip empty categories](https://tcgcsv.com/faq#missing-categories),
  these IDs are exposed in a `TCG_PLAYER_EMPTY_CATEGORY_IDS` constant.

## Installation

```
npm i @tcgdata/tcgcsv-client
```

## Usage

```ts
import { TCGCSVClient, TCG_PLAYER_CATEGORY_ID } from '@tcgdata/tcgscv-client';

// Create client object
const client = new TCGCSVClient({
  userAgent: 'YourApplication/X.Y.Z',
});

// Check when data was last updated
const lastUpdated = await client.getLastUpdated(); // 2026-08-27T20:05:59.000Z

// Query categories (different TCGs / product types)
// {
//   totalItems: 92,
//   success: true,
//   errors: [],
//   results: [
//     {
//       categoryId: 3,
//       name: 'Pokemon',
//       modifiedOn: '2026-08-27T17:14:32.333Z',
//       displayName: 'Pokemon',
//       seoCategoryName: 'Pokemon',
//       categoryDescription: "Trainers, your Pokémon adventure starts here! Browse Pokémon singles, booster packs, booster boxes, Elite Trainer Boxes, and the latest sets from thousands of trusted sellers. Whether you're catching your favorite Pokémon or growing your collection, you'll find everything you need on TCGplayer.",
//       categoryPageTitle: 'TCGplayer - Buy Pokémon TCG Cards, Singles, and Pack',
//       sealedLabel: 'Sealed Products',
//       nonSealedLabel: 'Single Cards',
//       conditionGuideUrl: 'https://store.tcgplayer.com/help/cardconditionguide',
//       isScannable: true,
//       popularity: 576635,
//       isDirect: true
//     },
//     ...
//   ]
// }
const categories = await client.getCategories();

// Query groups by category
// {
//   totalItems: 219,
//   success: true,
//   errors: [],
//   results: [
//     {
//       groupId: 17689,
//       name: 'SWSH: Crown Zenith: Galarian Gallery',
//       abbreviation: 'CRZ:GG',
//       isSupplemental: false,
//       publishedOn: '2023-01-20T00:00:00.000Z',
//       modifiedOn: '2026-08-12T23:12:27.827Z'
//     },
//     ...
//   ]
// }
const groups = await client.getGroups(TCG_PLAYER_CATEGORY_ID.POKEMON);

// Query products by group
// {
//   totalItems: 70,
//   success: true,
//   errors: [],
//   results: [
//     {
//       productId: 477057,
//       name: 'Mewtwo VSTAR',
//       cleanName: 'Mewtwo VSTAR',
//       imageUrl: 'https://tcgplayer-cdn.tcgplayer.com/product/477057_200w.jpg',
//       categoryId: 3,
//       groupId: 17689,
//       url: 'https://www.tcgplayer.com/product/477057/pokemon-swsh-crown-zenith-galarian-gallery-mewtwo-vstar',
//       modifiedOn: '2026-08-12T23:12:27.827Z',
//       imageCount: 1,
//       presaleInfo: { isPresale: false, releasedOn: null, note: null },
//       extendedData: [
//         {
//           name: 'Number',
//           displayName: 'Card Number',
//           value: 'GG44/GG70'
//         },
//         {
//           name: 'Rarity',
//           displayName: 'Rarity',
//           value: 'Ultra Rare'
//         },
//         {
//           name: 'Card Type',
//           displayName: 'Card Type',
//           value: 'Psychic'
//         },
//         {
//           name: 'HP',
//           displayName: 'HP',
//           value: '280'
//         },
//         {
//           name: 'Stage',
//           displayName: 'Stage',
//           value: 'VSTAR'
//         },
//         {
//           name: 'CardText',
//           displayName: 'Card Text',
//           value: '<em>VSTAR rule — When your Pokémon VSTAR is Knocked Out, your opponent takes 2 Prize cards.</em>'
//         },
//         {
//           name: 'Attack 1',
//           displayName: 'Attack 1',
//           value: '[1P] Psy Purge (90x)\r\n' +
//             '<br>\r\n' +
//             'Discard up to 3 Psychic Energy from your Pokémon. This attack does 90 damage for each card you discarded in this way.'
//         },
//         {
//           name: 'Attack 2',
//           displayName: 'Attack 2',
//           value: '<span style="color:gold"><strong>VSTAR Power</strong></span>\r\n' +
//             '<br>\r\n' +
//             '[1P] Star Raid\r\n' +
//             '<br>\r\n' +
//             "This attack does 120 damage to each of your opponent's Pokémon V. This damage isn't affected by Weakness or Resistance. <em>(You can't use more than 1 VSTAR Power in a game.)</em>"
//         },
//         {
//           name: 'Weakness',
//           displayName: 'Weakness',
//           value: 'Dx2'
//         },
//         {
//           name: 'Resistance',
//           displayName: 'Resistance',
//           value: 'F-30'
//         },
//         {
//           name: 'RetreatCost',
//           displayName: 'Retreat Cost',
//           value: '2'
//         }
//       ]
//     },
//     ...
//   ]
// }
const products = await client.getProducts(
  TCG_PLAYER_CATEGORY_ID.POKEMON,
  17689 // SWSH: Crown Zenith: Galarian Gallery
);

// Query product prices by group
// {
//   success: true,
//   errors: [],
//   results: [
//     {
//       productId: 477057,
//       lowPrice: 245,
//       midPrice: 310,
//       highPrice: 2495.8,
//       marketPrice: 276.56,
//       directLowPrice: 261.29,
//       subTypeName: 'Holofoil'
//     },
//     ...
//   ]
// }
const prices = await client.getProductPrices(
  TCG_PLAYER_CATEGORY_ID.POKEMON,
  17689 // SWSH: Crown Zenith: Galarian Gallery
);

// Query historical product prices for a date
// {
//   success: true,
//   errors: [],
//   results: [
//     {
//       productId: 477057,
//       lowPrice: 94.5,
//       midPrice: 124.54,
//       highPrice: 199.99,
//       marketPrice: 99.03,
//       directLowPrice: 137,
//       subTypeName: 'Holofoil'
//     },
//     ...
// ]
// }
const allHistoricalPrices = await client.getHistoricalProductPrices('2025-01-01');
const historicalPrices = await allHistoricalPrices.getPrices(
  TCG_PLAYER_CATEGORY_ID.POKEMON,
  17689 // SWSH: Crown Zenith: Galarian Gallery
);
```
