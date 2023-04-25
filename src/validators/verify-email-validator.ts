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

    // console.log(data);

    if (error) {
      console.log(error);
      next(error);
    }

    if (data) {
      const { verified, email: userEmail } = data[0] ?? {};
      if (verified === true && userEmail === email) {
        console.log('=== se cumplen las 2 ===');
        res.status(422).json({ err: 'this email is already in use' });
      } else if (userEmail === email) {
        req.body.emailExist = true;
        next();
      } else {
        console.log('=== NO se cumplen las 2 ===');

        next();
      }
    }
  }

  static useInstance() {
    if (!this.instance) {
      this.instance = new VerifyValidator();
    }

    return this.instance;
  }
}
