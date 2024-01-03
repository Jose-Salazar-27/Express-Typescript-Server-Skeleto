import { UserService } from '../services/user-services';
import { Request, Response } from 'express';
import { HttpCodes } from '../exceptions/custom-error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../shared/constants/identifiers';

@injectable()
export class UserController {
  public readonly service: UserService;
  constructor(@inject(TYPES.UserService) _service: UserService) {
    this.service = _service;
  }

  async messagesByRole(req: Request, res: Response) {
    try {
      const { role_name, level } = req.body;
      const result = await this.service.messagesByRole(role_name, level);

      if (result === null) {
        res.status(HttpCodes.FORBBIDEN).json({ err: 'Not allowed for your role' });
        return;
      }

      res.status(200).json({ result });
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
}
