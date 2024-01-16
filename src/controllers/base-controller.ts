import type { NextFunction, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
  public httpInternalError(res: Response): Response {
    return res.status(HttpStatusCode.InternalServerError);
  }

  public httpSuccess(res: Response, data: any): Response {
    return res.status(HttpStatusCode.Ok).json({ data });
  }

  public httpNotfound(res: Response, msg: string): Response {
    return res.status(HttpStatusCode.NotFound).json({ msg, data: [] });
  }

  public rejectHttpRequest(res: Response, status: number, context: any): Response {
    return res.status(status).json({ err: context });
  }
}
