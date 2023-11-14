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
import type { IUserRepository } from "./interfaces/repositories-interfaces";
import { UserRouter } from "../routes/users-routes";
import type { IServer } from "./interfaces/server-interface";
import { Server } from "../server";
import { UserController } from "../controllers/user-controllers";
import type { IAuthorizer } from "./interfaces/middleware-interfaces";
import { Authorizer } from "../middleware/authorizer";

export const container = new Container();

// setup middlewares
container.bind<IAuthorizer>(TYPES.Authorizer).to(Authorizer);

// setup controllers
container.bind<IUserController>(TYPES.UserController).to(UserController);

// setup services
container.bind<IUserService>(TYPES.UserService).to(UserService);

// setup repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

// setup routers
container.bind<IRouter>(TYPES.Router).to(MainRouter);
container.bind<IUserRouter>(TYPES.UserRotuer).to(UserRouter);

// setup server
container.bind<IServer>(TYPES.Server).to(Server);
