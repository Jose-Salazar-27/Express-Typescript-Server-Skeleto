import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { AuthController } from '../controllers/auth-controller';
import { verifyEmailValidator } from '../validators';
import { VerifyValidator } from '../validators/verify-email-validator';
import { TYPES } from '../shared/constants';

@injectable()
export class AuthRouter {
  protected router: Router;
  protected controller: AuthController;

  constructor(@inject(TYPES.Auth.controller) _controller: AuthController) {
    this.router = Router();
    this.controller = _controller;
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/discord', (req, res, next) => this.controller.discord(req, res, next));
    this.router.get('/discord/callback', (req, res, next) => this.controller.discordCallback(req, res, next));
    this.router.get('/user', (req, res, next) => this.controller.user(req, res, next));
    this.router.get('/ig', (req, res, next) => this.controller.getInstagramToken(req, res, next));
    this.router.get('/tw', (req, res) => {
      const { body, query } = req;
      console.log(body);
      console.log(query);
    });

    this.router.post(
      '/verify',
      (req, res, next) => VerifyValidator.useInstance().verifyBody(req, res, next),
      (req, res, next) => this.controller.verifyEmail(req, res, next)
    );
    this.router.put(
      '/verify-email',
      (req, res, next) => verifyEmailValidator(req, res, next),
      (req, res, next) => this.controller.verifyCode(req, res, next),
      (req, res, next) => this.controller.searchInDiscord(req, res, next),
      (req, res, next) => this.controller.setUserData(req, res, next)
    );
  }

  getRouter() {
    return this.router;
  }
}
