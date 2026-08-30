import { z } from 'zod';
import { TCGCSVClientProps, TCGCSVHistoricalProductPricesArchive } from './TCGCSVClient.types';
import {
  Category,
  CategorySchema,
  createListResponseSchema,
  Group,
  GroupSchema,
  ListResponse,
  Product,
  ProductPrice,
  ProductPriceSchema,
  ProductSchema,
} from '../schemas';
import { HistoricalProductPrices } from '../model';
import { isValidId, isValidIsoDate } from '../utils';
import { HTTPError, ValidationError } from '../error';

export class TCGCSVClient {
  #props: Required<TCGCSVClientProps>;

  public constructor(props: TCGCSVClientProps) {
    this.#props = {
      baseUrl: 'https://tcgcsv.com/',
      ...props,
    };
  }

  public async getCategories(): Promise<ListResponse<Category>> {
    return this.#requestAndParse('/tcgplayer/categories', createListResponseSchema(CategorySchema));
  }

  public async getGroups(categoryId: number): Promise<ListResponse<Group>> {
    if (!isValidId(categoryId)) {
      throw new ValidationError(`Category "${categoryId}" is invalid, must be a positive integer.`);
    }

    return this.#requestAndParse(
      `/tcgplayer/${categoryId}/groups`,
      createListResponseSchema(GroupSchema)
    );
  }

  public async getProducts(categoryId: number, groupId: number): Promise<ListResponse<Product>> {
    if (!isValidId(categoryId)) {
      throw new ValidationError(`Category "${categoryId}" is invalid, must be a positive integer.`);
    } else if (!isValidId(groupId)) {
      throw new ValidationError(`Group "${groupId}" is invalid, must be a positive integer.`);
    }

    return this.#requestAndParse(
      `/tcgplayer/${categoryId}/${groupId}/products`,
      createListResponseSchema(ProductSchema)
    );
  }

  public async getProductPrices(
    categoryId: number,
    groupId: number
  ): Promise<ListResponse<ProductPrice>> {
    if (!isValidId(categoryId)) {
      throw new ValidationError(`Category "${categoryId}" is invalid, must be a positive integer.`);
    } else if (!isValidId(groupId)) {
      throw new ValidationError(`Group "${groupId}" is invalid, must be a positive integer.`);
    }

    return this.#requestAndParse(
      `/tcgplayer/${categoryId}/${groupId}/prices`,
      createListResponseSchema(ProductPriceSchema)
    );
  }

  public async getHistoricalProductPricesArchive(
    date: string
  ): Promise<TCGCSVHistoricalProductPricesArchive> {
    if (!isValidIsoDate(date)) {
      throw new ValidationError(`Date "${date}" is invalid, must be a valid ISO date.`);
    }

    const fileName = `prices-${date}.ppmd.7z`;
    const response = await this.#request(`/archive/tcgplayer/${fileName}`);

    if (!response.body) {
      throw new Error('No response body was returned.');
    }

    return {
      date,
      archive: response.body,
      fileName,
    };
  }

  public async getHistoricalProductPrices(date: string): Promise<HistoricalProductPrices> {
    const { archive: stream } = await this.getHistoricalProductPricesArchive(date);
    const reader = stream.getReader();
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

    const archive = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
      archive.set(chunk, offset);
      offset += chunk.length;
    }

    return new HistoricalProductPrices(date, archive);
  }

  public async getLastUpdated(): Promise<Date> {
    const response = await this.#request('/last-updated.txt');
    const responseBody = await response.text();
    const date = new Date(responseBody);

    if (!responseBody || isNaN(date.getTime())) {
      throw new ValidationError(
        `Invalid last updated time "${responseBody}" returned from TCGCSV.`
      );
    }

    return date;
  }

  async #requestAndParse<T>(url: string, schema: z.ZodType<T>): Promise<T> {
    const response = await this.#request(url);
    const body = await response.json();
    return schema.parse(body);
  }

  async #request(url: string): Promise<Response> {
    const resolvedUrl = new URL(url, this.#props.baseUrl);
    const response = await fetch(resolvedUrl, {
      headers: {
        'user-agent': this.#props.userAgent,
      },
    });

    if (!response.ok) {
      throw new HTTPError(
        `Failed to fetch "${resolvedUrl}", received status ${response.status}: ${await response.clone().text()}`,
        { response }
      );
    }

    return response;
  }
}
