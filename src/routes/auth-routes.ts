import { Router } from 'express';
import { TokenHandler } from '../middleware/token-handler';
import { AuthController } from '../controllers/auth-controller';

export class AuthRouter {
  protected router: Router;
  protected controller: AuthController;
  protected service: any;
  protected middleware: TokenHandler;

  constructor() {
    this.router = Router();
    this.service = '';
    this.controller = new AuthController();
    this.middleware = TokenHandler.getMiddleware();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/discord', (req, res) => this.controller.discord(req, res));
    this.router.get('/discord/callback', (req, res) => this.controller.discordCallback(req, res));
    this.router.get('/user', (req, res) => this.controller.user(req, res));
    this.router.get('/test', (req, res) => this.controller.test(req, res));

    this.router.post('/verify', (req, res) => this.controller.verifyEmail(req, res));
    this.router.get(
      '/verify-email',
      (req, res, next) => this.middleware.verify(req, res, next),
      (req, res) => this.controller.verifyToken(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}
