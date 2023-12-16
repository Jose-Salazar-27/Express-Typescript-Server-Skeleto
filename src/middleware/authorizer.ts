import { inject, injectable } from "inversify";
import type { Request, Response, NextFunction } from "express";
import { ConstraintsConfigurator } from "../helpers/constraints-configurator";
import { UserService } from "../services/user-services";
import { CustomError, HttpCodes } from "../exceptions/custom-error";
import { UserRepository } from "../repositories/user-repository";
import { TYPES } from "../shared/constants/identifiers";
import { IUserService } from "../dependency-injection";

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
      res
        .status(HttpCodes.BAD_REQUEST)
        .json({ err: "must provide a valid role" });
      throw new CustomError({
        description: "must provide a valid role",
        httpCode: HttpCodes.BAD_REQUEST,
      });
    }

    req.body.role_name = roleName;
    console.log(`SENDING ROLE NAME: ${roleName}`);
    next();
  }

  public setRoleName(role: string) {
    const roleNames = {
      [this.roles.tryout]: "tryout",
      [this.roles.academy]: "academy",
      [this.roles.first_team]: "first_team",
      [this.roles.legend]: "legend",
    };

    console.log(`THE ROLE NAMES COLLECTION ARE ${roleNames}`);

    return roleNames[role];
  }
}
