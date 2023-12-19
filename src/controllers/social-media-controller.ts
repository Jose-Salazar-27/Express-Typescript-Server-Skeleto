import { inject, injectable } from 'inversify';
import type { Request, Response } from 'express';
import { ISocialMediaService } from '../dependency-injection';
import { TYPES } from '../shared/constants';
import { SocialMediaService } from '../services/social-media-service';
import { HttpCodes, HttpException } from '../exceptions/custom-error';
import { BaseController } from './base-controller';

@injectable()
export class SocialMediaController extends BaseController {
  public readonly service: ISocialMediaService;

  constructor(@inject(TYPES.Social_Media.service) _service: SocialMediaService) {
    super();
    this.service = _service;
  }

  public getInstagramPhotos(req: Request, res: Response): void {
    try {
      const urls = this.service.getInstagramPhotos();
      res.status(HttpCodes.OK).json({ urls });
    } catch (error) {
      // throw empty exception casue has default values
      // and error type is unknow and typescript doesn't allow pass arguments to exception
      throw new HttpException();
    }
  }

  public async getDiscordNews(req: Request, res: Response) {
    try {
      const { limit } = req.query;
      const messages = await this.service.getDiscordNews(Number(limit));

      if (messages.length < 1) {
        return this.httpInternalError(res);
      }
      return this.httpSuccess(res, messages);
    } catch (error) {
      throw new HttpException();
    }
  }
}
