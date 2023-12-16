import { inject, injectable } from "inversify";
import type { Request, Response } from "express";
import { ISocialMediaService } from "../dependency-injection";
import { TYPES } from "../shared/constants";
import { SocialMediaService } from "../services/social-media-service";
import { HttpCodes, HttpException } from "../exceptions/custom-error";

@injectable()
export class SocialMediaController {
  public readonly service: ISocialMediaService;

  constructor(
    @inject(TYPES.Social_Media.service) _service: SocialMediaService
  ) {
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
}
