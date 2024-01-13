import { dataSets } from '../shared/axiom/datasets';

export class HttpError extends Error {
  private readonly _code: number;
  private readonly _context: { [key: string]: any };
  private readonly _dataSet: dataSets;

  constructor(params?: { code?: number; dataSet: dataSets; message?: string; context?: { [key: string]: any } }) {
    const { code, message } = params || {};

    super(message || 'Bad request');
    this._code = code || 400;
    this._context = params?.context || {};
    this._dataSet = params?.dataSet || dataSets.api;

    Object.setPrototypeOf(this, HttpError.prototype);
  }

  get context(): any {
    return this.context;
  }

  get dataSet() {
    return this._dataSet;
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }
}

// export class AxiomEvent extends Error {
//   private readonly _code: number;
//   private readonly _context: { [key: string]: any };
//   private readonly _dataSet: dataSets;

//   constructor(params?: { code?: number; dataSet: dataSets; message?: string; context?: { [key: string]: any } }) {
//     const { code, message } = params || {};

//     super(message || 'Bad request');
//     this._code = code || 500;
//     this._context = params?.context || {};
//     this._dataSet = params?.dataSet || dataSets.api;

//     Object.setPrototypeOf(this, HttpError.prototype);
//   }

//   get dataSet() {
//     return this._dataSet;
//   }

//   get context(): any {
//     return this.context;
//   }

//   get error() {
//     return { message: this.message };
//   }

//   get status() {
//     return this._code;
//   }
// }
