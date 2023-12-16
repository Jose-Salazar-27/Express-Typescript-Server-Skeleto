import "reflect-metadata";
import { container } from "./dependency-injection";
import { Server } from "./server";
import { TYPES } from "./shared/constants/identifiers";

const server = container.get<Server>(TYPES.Server);

server.start();
