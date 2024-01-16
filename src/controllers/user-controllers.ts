import { UserService } from '../services/user-services';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../shared/constants/identifiers';
import { HttpStatusCode } from 'axios';

@injectable()
export class UserController {
  public readonly service: UserService;
  constructor(@inject(TYPES.UserService) _service: UserService) {
    this.service = _service;
  }

  async messagesByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { userLevel, level, role } = req.body;
      const result = await this.service.messagesByRole(level, userLevel);

      if (result === null) {
        res.status(HttpStatusCode.Forbidden).json({ err: 'Not allowed for your role' });
        return;
      }

      res.status(HttpStatusCode.Ok).json({ result });
    } catch (err) {
      next({ err, path: req.originalUrl });
    }
  }

  async getGiveAways(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.body.username as string;
      const role = await this.service.getUserRole(username);
      const giveAways = await this.service.getGiveAwayByRole(role[0]);
      res.send(giveAways);
    } catch (err) {
      next({ err, path: req.originalUrl });
    }
  }
}
