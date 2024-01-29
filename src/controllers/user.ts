import { Request, Response } from 'express';
import user from '../models/user';

export interface RequestUser extends Request {
  user?: {
    _id: string;
  };
}

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(user =>
      res.send({ data: user })
    )
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return user.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).json({ message: 'переданы некорректные данные в методы создания пользователя' });
      }
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
      }
      return res.status(200).json(user);
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).json({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(500).json({ message: "Произошла ошибка" });
    });
};

export const UpdateUserInfo = (req: RequestUser, res: Response) => {
  const userId = req.user?._id;
  const { name, about } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: "Переданы некорректные данные при обновлении профиля" });
  }

  user.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).json({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(500).json({ message: "Ошибка на сервере" });
    });
};

export const UpdateAvatar = (req: RequestUser, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ message: "Переданы некорректные данные при обновлении профиля" });
  }

  user.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).json({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(500).json({ message: "Ошибка на сервере" });
    })
}