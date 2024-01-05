import * as dotenv from 'dotenv';
import { container } from './dependency-injection';
import { Server } from './server';
import { TYPES } from './shared/constants/identifiers';

const bootstrap = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    dotenv.config({
      path:
        process.env.NODE_ENV === 'production' ? `${__dirname}/.env` : `${__dirname}/../.env.${process.env.NODE_ENV}`,
    });
    resolve();
  })
    .then(() => {
      const server = container.get<Server>(TYPES.Server);
      server.start();
    })
    .catch((err) => console.log(err));
};

bootstrap();
