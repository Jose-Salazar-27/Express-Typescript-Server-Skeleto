export class HttpException extends Error {
  private readonly _code: number;
  private readonly _context: { [key: string]: any };

  constructor(params?: { code?: number; message?: string; context?: { [key: string]: any } }) {
    const { code, message } = params || {};

    super(message || 'Bad request');
    this._code = code || 500;
    this._context = params?.context || {};

    Object.setPrototypeOf(this, HttpException.prototype);
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }
}
