import { Request } from 'express';
import { ErrorMessages } from '../helpers/error-messages';
import { IsEmail, IsPassword } from '../helpers/validation-regex';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

export class LoginUserDTO {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  static createInstance(req: Request): LoginUserDTO {
    const { email, password } = req.body;

    return new LoginUserDTO(email, password);
  }

  validate(): string[] {
    const errors: string[] = [];

    // Email validations
    if (!this.email) {
      errors.push(ErrorMessages.Email_missing);
    } else if (!IsEmail(this.email)) {
      errors.push(ErrorMessages.Email_invalid);
    }

    // password validations
    if (!this.password) {
      errors.push(ErrorMessages.Password_missing);
    } else if (!IsPassword(this.password)) {
      errors.push(ErrorMessages.Password_invalid);
    }

    return errors;
  }
}
