import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../helpers/error-messages';

export const verifyEmailValidator = (req: Request, res: Response, next: NextFunction) => {
  body('email').isEmail().withMessage(ErrorMessages.Email_invalid).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
