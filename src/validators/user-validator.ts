import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models';
import { ErrorMessages } from '../helpers/error-messages';

const validate = (request: Request, response: Response, next: NextFunction) => {
  try {
    validationResult(request).throw();
    next();
  } catch (error) {
    console.log(`error en el middlewar, checa aqui prro 
      ${error}
    `);
    response.status(403).send({ errors: 'algo salio mal prro', error });
  }
};

class Validator {
  public validate() {
    body('name').exists().notEmpty().withMessage(ErrorMessages.User_missing), body('password').exists().notEmpty().withMessage(ErrorMessages.Password_missing), (request: Request, response: Response, next: NextFunction) => validate(request, response, next);
  }
}

export const UserValidator = new Validator();

export const validadorUsuario = [body('name').exists().notEmpty().withMessage(ErrorMessages.User_missing), body('password').exists().notEmpty().withMessage(ErrorMessages.Password_missing), (request: Request, response: Response, next: NextFunction) => validate(request, response, next)];
