import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as userRouter } from './routes/users-routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Routers
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
