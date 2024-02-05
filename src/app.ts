import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import routes from './routes/index'
import { ERROR_CODE_NOT_FOUND } from './errors/errors';
import { Login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import  logger from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(logger.requestLogger);

app.post('/signin', Login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', routes);

app.use((req: Request, res: Response) => {
  res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Передан несуществующий маршрут' });
});

app.use(logger.errorLogger);



app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});