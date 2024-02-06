import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusUnauthorized } from '../errors/customError';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (res: Response, next: NextFunction) => {
  const authenticationError = new StatusUnauthorized('Необходима авторизация');
  return next(authenticationError);
};

const extractBearerToken = (token: string) => token.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
