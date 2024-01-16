import { inject, injectable } from 'inversify';
import type { NextFunction, Request, Response } from 'express';
import { TYPES } from '../shared/constants';
import { SocialMediaService } from '../services/social-media-service';
import { BaseController } from './base-controller';
import { HttpStatusCode } from 'axios';

@injectable()
export class SocialMediaController extends BaseController {
  public readonly service: SocialMediaService;

  constructor(@inject(TYPES.Social_Media.service) _service: SocialMediaService) {
    super();
    this.service = _service;
  }

  public async getInstagramPhotos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = await this.service.getInstagramPhotos();
      res.status(HttpStatusCode.Ok).json({ payload });
    } catch (error) {
      next({ err: error, path: req.originalUrl });
    }
  }

  public async getDiscordNews(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit } = req.query;
      const messages = await this.service.getDiscordNews(Number(limit));

      if (messages.length < 1) {
        return this.httpInternalError(res);
      }
      return this.httpSuccess(res, messages);
    } catch (error) {
      next({ err: error, path: req.originalUrl });
    }
  }
}
