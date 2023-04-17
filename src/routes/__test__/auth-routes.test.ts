import * as dotenv from 'dotenv';
import { server, request } from '../../config/test-setup';
import axios from 'axios';

beforeAll(() => {
  dotenv.config();
  server.start();
});

afterAll(() => {
  server.stop();
}, 10000);

// describe('POST /api/auth/verify/', () => {
//   it('Shold return a token is ok message', async () => {
//     const payload = { email: 'joseandres61@gmail.com' };

//     const response = await request.post('/api/auth/verify').send(payload);
//     expect(response.statusCode).toBe(200);

//     // console.log(response);
//   });
// });

describe('GET Discord user', () => {
  const TOKEN = 'MTA5NjIwMDA1Njg5NTQ0MzA1NA.GHsTVW.ZJakNfvLF-zTJNvJcG3h5XvRaWSZPFzGpxL6a4';
  const USER_ID = '969044990481281094';
  const GUILD_ID = '1086689618197483540';

  it('Should return "valid token message & 200 status code"', async () => {
    const response = await request.get(`https://discord.com/api/v9/guilds/${GUILD_ID}/members/${USER_ID}`);
    expect(response.statusCode).toBe(200);

    console.log(response.body);
  });
});
