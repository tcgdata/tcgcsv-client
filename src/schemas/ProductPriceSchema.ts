import { z } from 'zod';

export const ProductPriceSchema = z.object({
  productId: z.number(),
  lowPrice: z.number(),
  midPrice: z.number(),
  highPrice: z.number(),
  marketPrice: z.number().nullable(),
  directLowPrice: z.number().nullable(),
  subTypeName: z.string(),
});

export type ProductPrice = z.infer<typeof ProductPriceSchema>;
