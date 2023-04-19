import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { ServerConfig } from '../config/server-config';

export class TokenHandler extends ServerConfig {
  protected static instance?: TokenHandler;
  constructor() {
    super();
  }

  verify(req: Request, res: Response, next: NextFunction) {
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

  // MOVER ESTO A OTRO LADO LUEGO
  generate() {
    const code = uuid();
    return code.toUpperCase().split('-').shift();
  }

  generateJWT(payload: object) {
    const secretKey = this.getEnvVar('JWT_PUBLIC_KEY');
    const token = jwt.sign({ payload }, secretKey, { expiresIn: '5m' });

    return token;
  }

  decode(token: string) {
    return jwt.decode(token);
  }

  static getMiddleware() {
    if (!this.instance) {
      this.instance = new TokenHandler();
    }

    return this.instance;
  }
}
