import axios, { AxiosInstance } from 'axios';
import { getEnv } from './getenv';

export const setupHttpClient = (): AxiosInstance => {
  const token = getEnv('BOT_TOKEN');
  return axios.create({
    baseURL: 'https://discord.com/api/v9',
    headers: {
      Authorization: `Bot ${token}`,
    },
  });
};
