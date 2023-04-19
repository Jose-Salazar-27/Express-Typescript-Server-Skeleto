import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Middleware Error Hadnling');
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    // TODO colocar ell err.stack solo para entorno de desarrollo
    // stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    stack: err.stack,
  });
};

export default ErrorHandler;
