import "reflect-metadata";
import { config } from "./Config";
import { LJRPServer } from "./LJRPServer";

const server = new LJRPServer();
server.start(config.port);
