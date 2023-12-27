import { HttpCodes } from '../custom-error';

export interface ErrorArgs {
  name?: string;
  httpCode: number;
  description: string;
  isOperational?: boolean;
}
