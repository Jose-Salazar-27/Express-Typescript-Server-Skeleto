import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import { router as userRouter } from './routes/users-routes';

const app: Express = express();
const port = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
