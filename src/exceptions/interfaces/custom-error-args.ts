import { HttpCodes } from '../custom-error';

export interface ErrorArgs {
  name?: string;
  httpCode: HttpCodes;
  description: string;
  isOperational?: boolean;
}
