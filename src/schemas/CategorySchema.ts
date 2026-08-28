import { z } from 'zod';
import { LooseIsoDateTime } from '../validators';

export const CategorySchema = z.object({
  categoryId: z.number(),
  name: z.string(),
  modifiedOn: LooseIsoDateTime,
  displayName: z.string(),
  seoCategoryName: z.string(),
  categoryDescription: z.string().nullable(),
  categoryPageTitle: z.string().nullable(),
  sealedLabel: z.string().nullable(),
  nonSealedLabel: z.string().nullable(),
  conditionGuideUrl: z.string(),
  isScannable: z.boolean(),
  popularity: z.number(),
  isDirect: z.boolean(),
});

export type Category = z.infer<typeof CategorySchema>;
