import { Server } from './server';

(async () => {
  try {
    new Server().start();
  } catch (err) {
    console.log(err);
  }
})();
