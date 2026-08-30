export type TCGCSVClientProps = {
  baseUrl?: string;
  userAgent: string;
};

export type TCGCSVHistoricalProductPricesArchive = {
  archive: ReadableStream<Uint8Array>;
  fileName: string;
  date: string;
};
