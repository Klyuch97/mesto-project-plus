import { Request, Response } from 'express';
import user from '../models/user';

export interface RequestUser extends Request {
  user?: {
    _id: string;
  };
}

export const getUsers = (req: Request, res: Response) => {
  return user.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return user.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params;

  user.findById(userId)
    .then((user) => {
      if (!user) {
        res.json({ message: 'Пользователь не найден' });
      }
      return res.status(200).json(user);
    })
    .catch(() => {
      res.json({ message: "Ошибка" });
    });
};

export const UpdateUserInfo = (req: RequestUser, res: Response) => {
  const userId = req.user?._id;
  const { name, about } = req.body;

  user.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch(() => {
      res.json({ message: "Ошибка" });
    });
};