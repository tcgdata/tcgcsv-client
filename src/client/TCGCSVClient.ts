import { z } from 'zod';
import { TCGCSVClientProps } from './TCGCSVClient.props';
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
      throw new Error(`Category "${categoryId}" is invalid, must be a positive integer.`);
    }

    return this.#requestAndParse(
      `/tcgplayer/${categoryId}/groups`,
      createListResponseSchema(GroupSchema)
    );
  }

  public async getProducts(categoryId: number, groupId: number): Promise<ListResponse<Product>> {
    if (!isValidId(categoryId)) {
      throw new Error(`Category "${categoryId}" is invalid, must be a positive integer.`);
    } else if (!isValidId(groupId)) {
      throw new Error(`Group "${groupId}" is invalid, must be a positive integer.`);
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
      throw new Error(`Category "${categoryId}" is invalid, must be a positive integer.`);
    } else if (!isValidId(groupId)) {
      throw new Error(`Group "${groupId}" is invalid, must be a positive integer.`);
    }

    return this.#requestAndParse(
      `/tcgplayer/${categoryId}/${groupId}/prices`,
      createListResponseSchema(ProductPriceSchema)
    );
  }

  public async getHistoricalProductPrices(date: string): Promise<HistoricalProductPrices> {
    if (!isValidIsoDate(date)) {
      throw new Error(`Date "${date}" is invalid, must be a valid ISO date.`);
    }

    const response = await this.#request(`/archive/tcgplayer/prices-${date}.ppmd.7z`);

    if (!response.body) {
      throw new Error('No response body was returned.');
    }

    return new HistoricalProductPrices(date, await response.bytes());
  }

  public async getLastUpdated(): Promise<Date> {
    const response = await this.#request('/last-updated.txt');
    const responseBody = await response.text();
    const date = new Date(responseBody);

    if (!responseBody || isNaN(date.getTime())) {
      throw new Error(`Invalid last updated time "${responseBody}" returned from TCGCSV.`);
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
      throw new Error(
        `Failed to fetch "${resolvedUrl}", received status ${response.status}: ${await response.text()}`
      );
    }

    return response;
  }
}
