import { UserService } from '../services/user-services';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { Request, Response } from 'express';

export class UserController {
  protected service: UserService;
  constructor() {
    this.service = new UserService();
  }

  // async getPosts(req: Request, res: Response) {
  //   // const role = req.body.roles[0] as string;
  //   const role = req.body.role as string;
  //   console.log(`role is: ${role}`);

  //   const roles = this.service.getRoles();

  //   // const messages = await this.service.getAlphaPost();
  //   // console.log(messages);

  //   switch (role) {
  //     case roles.alpha:
  //       console.log('==== ALFA LOGIC ====');
  //       const alphaMessages = await this.service.getAlphaPost();
  //       res.send({ messages: alphaMessages });

  //       break;

  //     case roles.legend:
  //       console.log('==== LEGEND LOGIC ====');

  //       const legendMessages = await this.service.getLegendPosts();
  //       res.send({ messages: legendMessages });

  //       break;

  //     case roles.tryout:
  //       console.log('==== TRYOUT LOGIC ====');

  //       const tryoutMessages = await this.service.getTryoutPosts();
  //       res.send({ messages: tryoutMessages });

  //       break;

  //     default:
  //       res.status(500).json({ err: 'role not provided' });
  //   }
  // }

  async getPosts(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const userInfo = await this.service.getUserRole(username);
      const [user] = userInfo;

      if (user !== undefined && user !== null) {
        const { roles } = user;
        const posts = await this.service.filterByRole(roles[0]);
        const [data] = posts;

        res.status(200).json({ payload: data });
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
