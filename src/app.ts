import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import { router as userRouter } from './routes/users-routes';

const app: Express = express();
const port = process.env.PORT;

// Routers
app.use('/api/users', userRouter);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
