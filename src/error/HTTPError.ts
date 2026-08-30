export class HTTPError extends Error {
  public readonly response?: Response;

  constructor(message: string, options?: ErrorOptions & { response?: Response }) {
    super(message, options);
    this.name = 'HTTPError';
    this.response = options?.response;
  }
}
