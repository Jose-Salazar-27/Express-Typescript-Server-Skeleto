import { Request, Response } from 'express';
import { AuthServices } from '../services/auth-services';
import { TokenHandler } from '../middleware/token-handler';
import { Token } from '../models/token-model';
import { JwtPayload } from 'jsonwebtoken';

export class AuthController {
  protected service: AuthServices;

  constructor() {
    this.service = new AuthServices();
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, id } = req.body;
      const result = await this.service.sendToken(email, id);

      res.status(200).json({ payload: result });
    } catch (err) {
      res.status(400).json({ err });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const decode = <Token>TokenHandler.getMiddleware().decode(token);
      console.log('======== DECODED TOKEN ========');
      console.log(decode);

      if (!decode) {
        return res.status(500).json({ err: 'something is wrong with jwt' });
      }

      const result = this.service.fetchUserFromDiscord(decode);

      res.status(200).json({ payload: result });
    } catch (err) {
      res.status(401).json({ err });
    }
  }
}
