import type { Request, Response } from 'express';
import type { IUserService } from './services-interfaces';

export interface IUserController {
  readonly service: IUserService;
  messagesByRole(req: Request, res: Response): Promise<void>;
  getGiveAways(req: Request, res: Response): Promise<void>;
}

export interface ISocialMediaController {
  getInstagramPhotos(req: Request, res: Response): void;
  getDiscordNews(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
