import { Request, Response } from 'express';
import card from '../models/card'
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR, STATUS_OK } from '../errors/errors';

export interface RequestOwner extends Request {
  user?: {
    _id: string;
  };
}


export const createCard = (req: RequestOwner, res: Response) => {
  const { link, name } = req.body;
  const owner = req.user?._id;

  return card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные при создании карточки' });
      }
      res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка' });
    });
};

export const getCards = (req: Request, res: Response) => {
  return card.find({})
    .populate(['owner', 'likes'])
    .then(card => res.send({ data: card }))
    .catch(() => res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  card.findByIdAndDelete(cardId)
    .orFail()
    .then(card => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      if (error.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(ERROR_CODE_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

export const likeCard = (req: RequestOwner, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },).orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка на сервере' });
    });
}


export const dislikeCard = (req: RequestOwner, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: id } },
    { new: true },).orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для снятия лайка.' });

      }
      return res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка на сервере' });
    });
}