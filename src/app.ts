import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import routes from './routes/index';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import logger from './middlewares/logger';
import errorMiddleware from './middlewares/errorMiddlewar';
import { createUserValidator, loginValidator } from './validation/validation';
import { NotFoundError } from './errors/customError';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { errors: celebrateErrors } = require('celebrate');

app.use(logger.requestLogger);

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use('/', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const notFoundError = new NotFoundError('Передан несуществующий маршрут');
  return next(notFoundError);
});
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(logger.errorLogger);
app.use(errors());

app.use(celebrateErrors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});
