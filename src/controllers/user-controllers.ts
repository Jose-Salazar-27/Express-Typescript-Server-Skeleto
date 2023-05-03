import { UserService } from '../services/user-services';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { Request, Response } from 'express';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  async messagesByRole(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);
      const messages = await this.service.messagesByRole(role[0]);

      res.send(messages);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }

  async getGiveAways(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);
      const g = await this.service.getGAByRole(role[0]);
      res.send(g);
    } catch (err) {
      res.send(err);
    }
  }

  // TODO: remove this
  async getUserRole(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);

      res.send({ role });
    } catch (err) {
      res.send(err);
    }
  }
}
