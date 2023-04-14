import { Router } from 'express';
import { UserRouter } from './users-routes';
import { DiscordRouter } from './discord-routes';

export class MainRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.loadRoutes();
  }

  private loadRoutes(): void {
    const userRuter = new UserRouter();
    const discordRouter = new DiscordRouter();

    this.router.use('/users', userRuter.getRouter());
    this.router.use('/discord', discordRouter.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
