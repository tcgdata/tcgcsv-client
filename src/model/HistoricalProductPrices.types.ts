import { ListResponse, ProductPrice } from '../schemas';

export type HistoricalProductPricesExecProps = {
  args: Array<string>;
  output: (string: string) => void;
};

export type HistoricalProductPricesBulkGetPricesProps = {
  groups: Array<{ categoryId: number; groupId: number }>;
  batchSize?: number;
};

export type HistoricalProductPricesBulkGetPricesResult = {
  groupId: number;
  categoryId: number;
  prices?: ListResponse<ProductPrice>;
};
