import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR, HTTP_STATUS_CONFLICT, HTTP_STATUS_UNAUTHORIZED } from '../errors/errors';
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
 // console.error(err);
  let statusCode = ERROR_CODE_SERVER_ERROR;
  let message = 'Ошибка на сервере';



  if (err.name === 'ValidationError' && err.errors['avatar']) {
    return res.status(ERROR_CODE_BAD_REQUEST).json({ message: err.errors['avatar'].message });
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS_CONFLICT;
    message = 'Пользователь с таким email зарегестрирован';
  }

  if (err.name === 'ValidationError') {
    statusCode = ERROR_CODE_BAD_REQUEST;
    message = 'Переданы некорректные данные';
  }

  if (err.name === 'DocumentNotFoundError') {
    statusCode = ERROR_CODE_NOT_FOUND;
    message = 'Пользователь по указанному _id не найден'
  }

  if (err.name === 'CastError') {
    statusCode = ERROR_CODE_BAD_REQUEST;
    message = 'Переданы некорректные данные.'
  }

  if (err.name === "AuthenticationError") {
    statusCode = HTTP_STATUS_UNAUTHORIZED;
    message = 'Неправильные почта или пароль'
  }
  if (err.name === "CardNotFoundError") {
    statusCode = ERROR_CODE_NOT_FOUND;
    message = 'Карточка с указанным _id не найдена'
  }


  res.status(statusCode).json({ message: message });
};

export default errorMiddleware;