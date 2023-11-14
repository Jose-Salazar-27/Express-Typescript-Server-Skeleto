import cookieParser from "cookie-parser";
import express, { Application, Handler } from "express";
import bearerToken from "express-bearer-token";
import cors from "cors";
import ErrorHandler from "../middleware/error-handler";

const middlewares = [
  express.json(),
  cookieParser(),
  bearerToken(),
  cors({
    origin: "https://tiento-demo.vercel.app",
  }),
  express.urlencoded({ extended: true }),
  ErrorHandler,
];

const loadDependencies = (app: Application, middlewares: any[]): void => {
  middlewares.forEach((mid, index) => {
    app.use(mid);
    if (index == middlewares.length - 1) {
      console.log("middlewares was loaded succesfully");
    }
  });
};

export { loadDependencies, middlewares };
