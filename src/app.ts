import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index'
import { ERROR_CODE_NOT_FOUND } from './errors/errors';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import  logger from './middlewares/logger';
import errorMiddleware from './middlewares/errorMiddlewar';
import { errors } from 'celebrate';
import { createUserValidator, loginValidator } from './validation/validation';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { errors: celebrateErrors } = require("celebrate");

app.use(logger.requestLogger);

app.post('/signin',loginValidator, login);
app.post('/signup',createUserValidator, createUser);

app.use(auth);

app.use('/', routes);

app.use((req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Передан несуществующий маршрут' });
});
mongoose.connect('mongodb://localhost:27017/mestodb');


app.use(logger.errorLogger);
app.use(errors());

app.use(celebrateErrors())
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});