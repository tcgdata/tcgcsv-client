import { z } from 'zod';

export type ListResponse<T> = {
  totalItems?: number;
  success: boolean;
  errors: Array<unknown>;
  results: Array<T>;
};

export const createListResponseSchema = <T>(
  itemSchema: z.ZodType<T>
): z.ZodType<ListResponse<T>> => {
  return z.object({
    totalItems: z.number().optional(),
    success: z.boolean(),
    errors: z.array(z.unknown()),
    results: z.array(itemSchema),
  });
};
