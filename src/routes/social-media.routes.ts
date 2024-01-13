import { inject, injectable } from 'inversify';
import { Router } from 'express';
import { ISocialMediaController } from '../dependency-injection';
import { TYPES } from '../shared/constants';
import { SocialMediaController } from '../controllers/social-media-controller';
import { verifyAuth } from '../middleware/authorizer';

@injectable()
export class SocialMediaRouter {
  public readonly controller: SocialMediaController;
  private readonly router: Router;

  constructor(@inject(TYPES.Social_Media.controller) _controller: SocialMediaController) {
    this.controller = _controller;
    this.router = Router();
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get('/instagram', (req, res, next) => this.controller.getInstagramPhotos(req, res, next));
    this.router.post('/discord', verifyAuth, (req, res, next) => this.controller.getDiscordNews(req, res, next));
  }

  public getRouter() {
    return this.router;
  }
}
