import { z } from 'zod';
import { LooseIsoDateTime } from '../validators';

export const GroupSchema = z.object({
  groupId: z.number(),
  name: z.string(),
  abbreviation: z.string(),
  isSupplemental: z.boolean(),
  publishedOn: LooseIsoDateTime,
  modifiedOn: LooseIsoDateTime,
});

export type Group = z.infer<typeof GroupSchema>;
