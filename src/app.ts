import express from 'express';
import mongoose from 'mongoose';


const { PORT = 3000} = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb ')



app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});