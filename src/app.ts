import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from "./routes/user";
import cardRouter from './routes/card'


const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');


app.use((req: any, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65b758be7cdb9c7023455b3f' // вставьте здесь _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/', cardRouter);
app.use('/', userRouter);




app.listen(PORT, () => {
  console.log(`Сервер запущен на порту: ${PORT}`);
});