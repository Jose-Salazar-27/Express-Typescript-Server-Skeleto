import supertest from 'supertest';
import { Server } from '../../server';

const server = new Server();
const app = server.getApp();
const request = supertest(app);

beforeAll(() => {
  server.setPort();
  server.start();
});

afterAll(() => {
  server.stop();
});

describe('GET /api/users', () => {
  it('should return a list of users', async () => {
    request;
    const response = await request.get('/api/users/');
    expect(response.status).toBe(200);
  });
});

// describe('GET /api/discord/post', () => {
//   it('should return a list of posts depending on the role', async () => {});
// });
