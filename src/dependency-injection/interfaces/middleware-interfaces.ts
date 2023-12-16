import type { NextFunction, Request, Response } from "express";

export interface IAuthorizer {
  readonly service: unknown;
  authorize(req: Request, res: Response, next: NextFunction): Promise<void>;
  setRoleName(role: string): string;
}
