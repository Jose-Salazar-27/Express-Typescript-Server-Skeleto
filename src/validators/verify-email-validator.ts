import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../helpers/error-messages';
import { ServerConfig } from '../config/server-config';
import { prisma } from '../../prisma/prisma.client';

export const verifyEmailValidator = (req: Request, res: Response, next: NextFunction) => {
  body('email').isEmail().withMessage(ErrorMessages.Email_invalid),
    body('code').notEmpty().isLength({ min: 8, max: 8 }).withMessage(ErrorMessages.Email_invalid).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export class VerifyValidator extends ServerConfig {
  static instance: VerifyValidator;
  constructor() {
    super();
  }

  async verifyBody(req: Request, res: Response, next: NextFunction) {
    console.log('middleware is executing');

    const { email, code } = req.body;

    const user = await prisma.discordUser.findUnique({
      where: { email: email },
    });

    // if user not exists call controller to create and record
    if (!user) {
      req.body.emailExist = false;
      return next();
    }

    // reject request if email user is registered and verified
    if (user.verified && user.email === email) {
      return res.status(422).json({ err: 'this email is already in use' });
    }

    // if email exits and request has not been rejected call controller to perform and update
    if (user.email === email) {
      req.body.emailExist = true;
      return next();
    }
  }

  static useInstance() {
    if (!this.instance) {
      this.instance = new VerifyValidator();
    }

    return this.instance;
  }
}
