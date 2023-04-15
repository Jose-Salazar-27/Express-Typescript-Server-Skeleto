import { Router } from 'express';
import { DiscordController } from '../controllers/discord-controller';

export class DiscordRouter {
  protected router: Router;
  protected controller: DiscordController;

  constructor() {
    this.router = Router();
    this.controller = new DiscordController();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/post', (req, res) => this.controller.saveMessage(req, res));
    this.router.get('/post', (req, res) => this.controller.getPosts(req, res));
    // post/test/ route will be removed once there is time to write an appropriate test
    this.router.post('/post/test', (req, res) => this.controller.testMessage(req, res));
  }

  getRouter() {
    return this.router;
  }
}
