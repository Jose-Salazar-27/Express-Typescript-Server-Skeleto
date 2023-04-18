import supertest from 'supertest';
import { Server } from '../server';

const server = new Server();
const app = server.getApp();
const request = supertest(app);

export { server, request };
