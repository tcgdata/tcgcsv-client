import { z } from 'zod';
import { LooseIsoDateTime } from '../validators';

export const ProductPresaleInfoSchema = z.object({
  isPresale: z.boolean(),
  releasedOn: z.iso.datetime().nullable(),
  note: z.string().nullable(),
});

export const ProductExtendedDataItemSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  value: z.string(),
});

export const ProductSchema = z.object({
  productId: z.number(),
  name: z.string(),
  cleanName: z.string(),
  imageUrl: z.string(),
  categoryId: z.number(),
  groupId: z.number(),
  url: z.url(),
  modifiedOn: LooseIsoDateTime,
  imageCount: z.number(),
  presaleInfo: ProductPresaleInfoSchema,
  extendedData: z.array(ProductExtendedDataItemSchema),
});

export type ProductPresaleInfo = z.infer<typeof ProductPresaleInfoSchema>;
export type ProductExtendedDataItem = z.infer<typeof ProductExtendedDataItemSchema>;
export type Product = z.infer<typeof ProductSchema>;
