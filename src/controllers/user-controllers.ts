import { UserService } from '../services/user-services';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { Request, Response } from 'express';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  async getPosts(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const userInfo = await this.service.getUserRole(username);
      const [user] = userInfo;

      if (user !== undefined && user !== null) {
        const { roles } = user;
        const posts = await this.service.filterByRole(roles[0]);

        res.status(200).json(posts);
      } else {
        res.status(500).json({ err: 'cannot process your request at this moment' });
      }
    } catch (err) {
      res.send(err);
    }
  }

  // TODO: remove this
  async getRole(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);

      res.send({ role });
    } catch (err) {
      res.send(err);
    }
  }
}
