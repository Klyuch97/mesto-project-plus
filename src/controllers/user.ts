import { NextFunction, Request, Response } from 'express';
import user from '../models/user';
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR, STATUS_OK } from '../errors/errors';

export interface RequestUser extends Request {
  user?: {
    _id: string;
  };
}

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(user =>
      res.status(STATUS_OK).send({ data: user })
    )
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return user.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'переданы некорректные данные в методы создания пользователя' });
      }
      res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Пользователь не найден' });
      }
      return res.status(STATUS_OK).json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Пользователь по указанному _id не найден' });
      }

      res.status(ERROR_CODE_SERVER_ERROR).json({ message: "Произошла ошибка" });
    });
};

export const UpdateUserInfo = (req: RequestUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { name, about } = req.body;

  user.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {

      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: "Пользователь с указанным _id не найден" });
      }

      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: "Переданы некорректные данные при обновлении профиля" });
      }
      res.status(ERROR_CODE_SERVER_ERROR).json({ message: "Ошибка на сервере" });
    });
};

export const UpdateAvatar = (req: RequestUser, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;


  user.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: "Переданы некорректные данные при обновлении аватара" });
      }
      res.status(ERROR_CODE_SERVER_ERROR).json({ message: "Ошибка на сервере" });
    })
}