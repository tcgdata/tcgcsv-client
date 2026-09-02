import SevenZip from '../7z';
import {
  createListResponseSchema,
  ListResponse,
  ProductPrice,
  ProductPriceSchema,
} from '../schemas';
import {
  HistoricalProductPricesBulkGetPricesProps,
  HistoricalProductPricesBulkGetPricesResult,
} from './HistoricalProductPrices.types';
import { isValidId } from '../utils';
import { ValidationError } from '../error';

export class HistoricalProductPrices {
  readonly #filePrefix: string;
  readonly #data: Uint8Array<ArrayBufferLike>;

  private constructor(filePrefix: string, data: Uint8Array<ArrayBufferLike>) {
    this.#filePrefix = filePrefix;
    this.#data = data;
  }

  public async getGroups(): Promise<Array<{ categoryId: number; groupId: number }>> {
    const groups: Array<{ categoryId: number; groupId: number }> = [];
    const pattern = /\/(?<categoryId>\d+)\/(?<groupId>\d+)\/prices$/;
    const archive = await this.#getArchive({
      output: (string: string) => {
        const matches = string.match(pattern);

        if (matches?.groups) {
          const { categoryId, groupId } = matches.groups;
          groups.push({
            categoryId: Number(categoryId),
            groupId: Number(groupId),
          });
        }
      },
    });

    archive.callMain(['l', '-ba', 'archive.7z']);

    return groups;
  }

  public async getPrices(categoryId: number, groupId: number): Promise<ListResponse<ProductPrice>> {
    const result = this.bulkGetPrices({
      groups: [{ categoryId, groupId }],
    });

    const { value } = await result.next();

    if (!value || !value.prices) {
      throw new ValidationError(
        `Prices do not exist for group "${groupId}" in category "${categoryId}".`
      );
    }

    return value.prices;
  }

  public async *bulkGetPrices({
    groups,
    batchSize = 1_000,
  }: HistoricalProductPricesBulkGetPricesProps): AsyncGenerator<
    HistoricalProductPricesBulkGetPricesResult,
    void,
    unknown
  > {
    const uniqueGroups: Record<string, { categoryId: number; groupId: number }> = {};

    groups.forEach(({ categoryId, groupId }) => {
      if (!isValidId(categoryId)) {
        throw new ValidationError(
          `Category "${categoryId}" is invalid, must be a positive integer.`
        );
      } else if (!isValidId(groupId)) {
        throw new ValidationError(`Group "${groupId}" is invalid, must be a positive integer.`);
      }

      uniqueGroups[`${categoryId}/${groupId}`] = { categoryId, groupId };
    });

    const queue = Object.values(uniqueGroups);

    while (queue.length > 0) {
      const batch = queue.splice(0, batchSize);
      const extractedFiles = batch.map(
        ({ categoryId, groupId }) => `${this.#filePrefix}/${categoryId}/${groupId}/prices`
      );

      const archive = await this.#getArchive();
      archive.callMain(['x', 'archive.7z', ...Object.values(extractedFiles)]);

      const decoder = new TextDecoder();

      for (const { categoryId, groupId } of batch) {
        const pricesPath = `${this.#filePrefix}/${categoryId}/${groupId}/prices`;

        try {
          const prices = JSON.parse(decoder.decode(archive.FS.readFile(pricesPath)));
          archive.FS.unlink(pricesPath);

          yield {
            categoryId,
            groupId,
            prices: createListResponseSchema(ProductPriceSchema).parse(prices),
          };
        } catch {
          // Invalid category/group ID combination
          yield {
            categoryId,
            groupId,
            prices: undefined,
          };
        }
      }
    }
  }

  async #getArchive({ output }: { output?: (string: string) => void } = {}): Promise<
    ReturnType<typeof SevenZip>
  > {
    const archive = await SevenZip({
      print: output || (() => {}),
    });
    // const stream = archive.FS.open('archive.7z', 'w');
    // archive.FS.write(stream, this.#data, 0, this.#data.length);
    // archive.FS.close(stream);
    archive.FS.writeFile('archive.7z', this.#data);
    return archive;
  }

  public static async create(
    archive: ReadableStream | Uint8Array,
    date: string
  ): Promise<HistoricalProductPrices> {
    let data: Uint8Array;

    if (archive instanceof Uint8Array) {
      data = archive;
    } else {
      const reader = archive.getReader();
      const chunks = [];
      let totalLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        chunks.push(value);
        totalLength += value.length;
      }

      let offset = 0;
      data = new Uint8Array(totalLength);

      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
      }
    }

    return new HistoricalProductPrices(date, data);
  }
}
