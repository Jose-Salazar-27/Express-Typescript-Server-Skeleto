import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ServerConfig } from '../config/server-config';

export class TokenHandler extends ServerConfig {
  protected static instance?: TokenHandler;
  constructor() {
    super();
  }

  verifyJWT(req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const verified = jwt.verify(token, this.getEnvVar('JWT_PUBLIC_KEY'));
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  generateJWT(payload: object) {
    const secretKey = this.getEnvVar('JWT_PUBLIC_KEY');
    const token = jwt.sign({ data: payload }, secretKey, { expiresIn: '5m' });

    return token;
  }

  decodeJWT(token: string) {
    const t = jwt.decode(token);
    console.log(typeof t, t);
    return t;
  }

  static getMiddleware() {
    if (!this.instance) {
      this.instance = new TokenHandler();
    }

    return this.instance;
  }
}
