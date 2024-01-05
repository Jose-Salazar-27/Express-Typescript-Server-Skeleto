import { UserService } from '../services/user-services';
import { Request, Response } from 'express';
import { HttpException } from '../exceptions/custom-error';
import { inject, injectable } from 'inversify';
import { TYPES } from '../shared/constants/identifiers';
import { HttpStatusCode } from 'axios';

@injectable()
export class UserController {
  public readonly service: UserService;
  constructor(@inject(TYPES.UserService) _service: UserService) {
    this.service = _service;
  }

  async messagesByRole(req: Request, res: Response) {
    try {
      const { userLevel, level, role } = req.body;
      const result = await this.service.messagesByRole(level, userLevel);

      if (result === null) {
        res.status(HttpStatusCode.Forbidden).json({ err: 'Not allowed for your role' });
        return;
      }

      res.status(HttpStatusCode.Ok).json({ result });
    } catch (err) {
      console.log(err);
      throw new HttpException({ context: { err } });
    }
  }

  async getGiveAways(req: Request, res: Response) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);
      const g = await this.service.getGiveAwayByRole(role[0]);
      res.send(g);
    } catch (err) {
      throw new HttpException({ context: { err } });
    }
  }
}
