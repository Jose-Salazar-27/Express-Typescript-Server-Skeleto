import { Request, Response, NextFunction } from 'express';
import { LoginUserDTO } from '../models/user-model';

export function validateLoginUser(req: Request, res: Response, next: NextFunction): void {
  const validator = LoginUserDTO.createInstance(req);
  const errors = validator.validate();

  if (errors.length) {
    res.status(400).json(errors);
  } else {
    next();
  }
}
