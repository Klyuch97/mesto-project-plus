import { Request, Response, NextFunction } from 'express';
import {
  BadRequestError, NotFoundError, StatusForbidden, StatusUnauthorized,
} from '../errors/customError';
import { ERROR_CODE_SERVER_ERROR } from '../errors/errors';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err);
  const statusCode = ERROR_CODE_SERVER_ERROR;
  const message = 'Ошибка на сервере';

  if (err instanceof BadRequestError
    || err instanceof NotFoundError
    || err instanceof StatusForbidden
    || err instanceof StatusUnauthorized) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(statusCode).json({ message });

  return next();
};

export default errorMiddleware;
