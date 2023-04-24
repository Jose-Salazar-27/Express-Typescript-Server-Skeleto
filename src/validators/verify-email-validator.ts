import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../helpers/error-messages';
import { ServerConfig } from '../config/server-config';

export const verifyEmailValidator = (req: Request, res: Response, next: NextFunction) => {
  body('email').isEmail().withMessage(ErrorMessages.Email_invalid), body('code').notEmpty().isLength({ min: 8, max: 8 }).withMessage(ErrorMessages.Email_invalid).run(req);

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
    const { data, error } = await this.supabaseClient.from('dicord_users').select('*').eq('email', email);

    if (error) {
      console.log(error);
      next(error);
    }

    if (data && data.length > 0) {
      const { email: userEmail, verified } = data[0];
      if (userEmail === email && verified) {
        next(new Error('Email already in use'));
      }
    } else {
      next();
    }
  }

  static useInstance() {
    if (!this.instance) {
      this.instance = new VerifyValidator();
    }

    return this.instance;
  }
}
