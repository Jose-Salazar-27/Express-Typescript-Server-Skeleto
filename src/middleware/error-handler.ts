import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/custom-error";

const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";

  if (err instanceof HttpException) {
    return res.status(err.statusCode).json(err.errors);
  }

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default ErrorHandler;
