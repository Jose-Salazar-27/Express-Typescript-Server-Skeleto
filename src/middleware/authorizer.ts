import { inject, injectable } from 'inversify';
import type { Request, Response, NextFunction } from 'express';
import { ConstraintsConfigurator } from '../helpers/constraints-configurator';
import { UserService } from '../services/user-services';
import { CustomError, HttpCodes } from '../exceptions/custom-error';
import { UserRepository } from '../repositories/user-repository';
import { TYPES } from '../shared/constants/identifiers';
import { IUserService } from '../dependency-injection';
import axios, { HttpStatusCode } from 'axios';
import { ErrorMessages } from '../helpers/error-messages';
import { IDiscordUser } from '../models/discord-user-model';
import { getEnv } from '../helpers/getenv';
import { body, validationResult } from 'express-validator';
import { guildId } from '../shared/constants/discord';

@injectable()
export class Authorizer extends ConstraintsConfigurator {
  public readonly service: UserService;
  constructor(@inject(TYPES.UserService) _userService: UserService) {
    super();
    this.service = _userService;
  }

  async authorize(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username as string;

    console.log(username, typeof username);
    const role = await this.service.getUserRole(username);

    console.log(role);

    const roleName = this.setRoleName(role[0]);
    console.log(roleName);

    if (roleName === undefined) {
      res.status(HttpCodes.BAD_REQUEST).json({ err: 'must provide a valid role' });
      throw new CustomError({
        description: 'must provide a valid role',
        httpCode: HttpCodes.BAD_REQUEST,
      });
    }

    req.body.role_name = roleName;
    console.log(`SENDING ROLE NAME: ${roleName}`);
    next();
  }

  public setRoleName(role: string) {
    const roleNames = {
      [this.roles.tryout]: 'tryout',
      [this.roles.academy]: 'academy',
      [this.roles.first_team]: 'first_team',
      [this.roles.legend]: 'legend',
    };

    console.log(`THE ROLE NAMES COLLECTION ARE ${roleNames}`);

    return roleNames[role];
  }
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  // validate request body
  body('username').exists().withMessage('should provide a valid username').isString().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatusCode.BadRequest).json({ errors: errors.array() });
    return;
  }

  const username = req.body.username as string;
  if (username === '' || !username) {
    return res.status(HttpStatusCode.BadRequest).json({ error: ErrorMessages.Missing_data });
  }
  const result = await axios.get(`https://discord.com/api/v9/guilds/${guildId}/members/search?query=${username}`, {
    headers: {
      Authorization: `Bot ${getEnv('BOT_TOKEN')}`,
    },
  });

  const isAuth = validateResponse(result.data, username);
  if (isAuth) {
    return next();
  }

  return res.status(HttpStatusCode.Unauthorized).json({ error: ErrorMessages.User_not_Exists });
};

const validateResponse = (data: IDiscordUser[], criteria: string): boolean => {
  if (data.length < 1) {
    return false;
  }

  const exists = data.some((item) => item.user.username.toLowerCase() === criteria.toLowerCase());

  if (!exists) {
    return false;
  }

  return true;
};
