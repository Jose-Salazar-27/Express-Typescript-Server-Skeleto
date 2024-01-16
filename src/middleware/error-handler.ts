import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../exceptions/custom-error';
import { getEnv } from '../helpers/getenv';
import axios from 'axios';
import { dataSets } from '../shared/axiom/datasets';

const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  if (err instanceof HttpError) {
    res.status(err.statusCode).json(err.errors);
    return next(err);
  }

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
  return next(err);
};

export const AxiomTracking = async (error: any, req: Request, res: Response, next: NextFunction) => {
  const token = getEnv('AXIOM_TOKEN');
  const AxiomHeaders = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const { err, path } = error;

  // if error was not throwed as HttpError, means server crash
  if (err instanceof HttpError) {
    const response = await axios
      .post(
        `https://api.axiom.co/v1/datasets/${err.dataSet}/ingest`,
        [
          {
            context: err.context.message || err.context,
            message: err.message,
            path,
          },
        ],
        {
          headers: AxiomHeaders,
        }
      )
      .catch((err) => console.log(err));
    return; // do empty return because previus middleware handle http reject
  }

  //if err isn't HttpError
  const response = await axios
    .post(
      `https://api.axiom.co/v1/datasets/${dataSets.http}/ingest`,
      [
        {
          context: { message: err.message || JSON.stringify(err), path },
        },
      ],
      {
        headers: AxiomHeaders,
      }
    )
    .catch((err) => console.log(err));
  return;
};

export default ErrorHandler;
