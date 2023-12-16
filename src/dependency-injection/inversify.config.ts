import "reflect-metadata";
import { Container } from "inversify";
// import { UserController } from ".src/controllers/user-controllers";
import { TYPES } from "../shared/constants/identifiers";
import { UserRepository } from "../repositories/user-repository";
import { UserService } from "../services/user-services";
import { MainRouter } from "../routes";
import type { IRouter, IUserRouter } from "./interfaces/routers-interfaces";
import type { IUserController } from "./interfaces/controller-interfaces";
import type { IUserService } from "./interfaces/services-interfaces";
import {
  ISocialMediaRepository,
  type IUserRepository,
} from "./interfaces/repositories-interfaces";
import { UserRouter } from "../routes/users-routes";
import type { IServer } from "./interfaces/server-interface";
import { Server } from "../server";
import { UserController } from "../controllers/user-controllers";
import type { IAuthorizer } from "./interfaces/middleware-interfaces";
import { Authorizer } from "../middleware/authorizer";
import { AuthServices } from "../services/auth-services";
import { AuthController } from "../controllers/auth-controller";
import { AuthRouter } from "../routes/auth-routes";
import { SocialMediaRepository } from "../repositories/social-media-repository";
import { SocialMediaController } from "../controllers/social-media-controller";
import { SocialMediaService } from "../services/social-media-service";
import { SocialMediaRouter } from "../routes/social-media.routes";

export const container = new Container();

// setup middlewares
container.bind<IAuthorizer>(TYPES.Authorizer).to(Authorizer);

// setup controllers
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind(TYPES.Auth.controller).to(AuthController);
container.bind(TYPES.Social_Media.controller).to(SocialMediaController);

// setup services
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind(TYPES.Auth.service).to(AuthServices);
container.bind(TYPES.Social_Media.service).to(SocialMediaService);

// setup repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container
  .bind<ISocialMediaRepository>(TYPES.Social_Media.repository)
  .to(SocialMediaRepository);

// setup routers
container.bind<IRouter>(TYPES.Router).to(MainRouter);
container.bind<IUserRouter>(TYPES.UserRotuer).to(UserRouter);
container.bind(TYPES.Auth.router).to(AuthRouter);
container.bind(TYPES.Social_Media.router).to(SocialMediaRouter);

// setup server
container.bind<IServer>(TYPES.Server).to(Server);
