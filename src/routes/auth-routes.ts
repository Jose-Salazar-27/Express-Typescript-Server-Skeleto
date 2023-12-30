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
    this.router.get('/discord', (req, res) => this.controller.discord(req, res));
    this.router.get('/discord/callback', (req, res) => this.controller.discordCallback(req, res));
    this.router.get('/user', (req, res) => this.controller.user(req, res));
    this.router.get('/ig', (req, res) => this.controller.getInstagramToken(req, res));

    this.router.post(
      '/verify',
      (req, res, next) => VerifyValidator.useInstance().verifyBody(req, res, next),
      (req, res) => this.controller.verifyEmail(req, res)
    );
    this.router.put(
      '/verify-email',
      (req, res, next) => verifyEmailValidator(req, res, next),
      (req, res, next) => this.controller.verifyCode(req, res, next),
      (req, res, next) => this.controller.searchInDiscord(req, res, next),
      (req, res, next) => this.controller.setUserData(req, res, next)
    );
    this.router.get('/instagram', (req, res) => {
      console.log(req.query);
      return;
    });
  }

  getRouter() {
    return this.router;
  }
}
