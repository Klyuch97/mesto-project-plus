import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { STATUS_OK } from '../errors/errors';
import { BadRequestError, NotFoundError } from '../errors/customError';

export interface RequestUser extends Request {
  user?: {
    _id: string;
  };
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((user) => res.status(STATUS_OK).send({ data: user }))
  .catch((err) => next(err));

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.status(STATUS_OK).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          next(err);
        });
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  User.findById(userId).orFail()
    .then((user) => res.status(STATUS_OK).json(user))
    .catch((err) => {
      next(err);
    });
};

export const updateUserInfo = (req: RequestUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError('Пользователь с указанным _id не найден');
        return next(notFoundError);
      }
      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const badRequestError = new BadRequestError('Переданы некорректные данные для обновления информации о себе');
        return next(badRequestError);
      }
      return next(err);
    });
};

export const updateAvatar = (req: RequestUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError('Пользователь с указанным _id не найден');
        return next(notFoundError);
      }
      return res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const badRequestError = new BadRequestError('Переданы некорректные данные для обновления аватара');
        return next(badRequestError);
      }
      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(err));
};

export const getCurrentUser = (req: RequestUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError('Пользователь с указанным _id не найден');
        return next(notFoundError);
      }
      return res.status(STATUS_OK).json({ data: user });
    })
    .catch((err) => next(err));
};
