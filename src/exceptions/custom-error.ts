import { ErrorArgs } from './interfaces/custom-error-args';

export enum HttpCodes {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBBIDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class CustomError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean = true;

  constructor(args: ErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}

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
