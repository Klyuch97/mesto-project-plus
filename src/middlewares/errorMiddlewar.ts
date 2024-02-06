import { BadRequestError, NotFoundError, StatusForbidden, StatusUnauthorized } from '../errors/customError';
import { ERROR_CODE_SERVER_ERROR} from '../errors/errors';
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err);
   let statusCode = ERROR_CODE_SERVER_ERROR;
   let message = 'Ошибка на сервере';

  if (err instanceof BadRequestError ||
    err instanceof NotFoundError ||
    err instanceof StatusForbidden||
    err instanceof StatusUnauthorized) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(statusCode).json({ message: message });
};
