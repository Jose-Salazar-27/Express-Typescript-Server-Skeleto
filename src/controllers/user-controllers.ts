import { UserService } from '../services/user-services';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { Request, Response } from 'express';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  async getPosts(req: Request, res: Response) {
    // const role = req.body.roles[0] as string;
    const role = req.body.role as string;
    console.log(`role is: ${role}`);

    const roles = this.service.getRoles();

    // const messages = await this.service.getAlphaPost();
    // console.log(messages);

    switch (role) {
      case roles.alpha:
        console.log('==== ALFA LOGIC ====');
        const alphaMessages = await this.service.getAlphaPost();
        res.send({ messages: alphaMessages });

        break;

      case roles.legend:
        console.log('==== LEGEND LOGIC ====');

        const legendMessages = await this.service.getLegendPosts();
        res.send({ messages: legendMessages });

        break;

      case roles.tryout:
        console.log('==== TRYOUT LOGIC ====');

        const tryoutMessages = await this.service.getLegendPosts();
        res.send({ messages: tryoutMessages });

        break;

      default:
        res.status(500).json({ err: 'role not provided' });
    }
  }
}
