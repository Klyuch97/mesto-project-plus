import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { STATUS_OK } from '../errors/errors';
import { BadRequestError, NotFoundError, StatusForbidden } from '../errors/customError';

export interface RequestOwner extends Request {
  user?: {
    _id: string;
  };
}

export const createCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const { link, name } = req.body;
  const owner = req.user?._id;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card) => res.send({ data: card }))
  .catch((err) => next(err));

export const deleteCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError('Карточка с указанным _id не найдена');
        return next(notFoundError);
      }
      if (card.owner.toString() !== userId) {
        const statusForbidden = new StatusForbidden('У вас нет прав на удаление этой карточки');
        return next(statusForbidden);
      }

      return card.deleteOne()
        .then(() => {
          res.status(STATUS_OK).json({ message: 'Карточка успешно удалена' });
        })
        .catch((error: any) => {
          next(error);
        });
    })
    .catch((err) => {
      next(err);
    });
};

export const likeCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError('Карточка с указанным _id не найдена');
        return next(notFoundError);
      }
      return res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const badRequestError = new BadRequestError('Переданы некорректные данные для поставновки лайка');
        return next(badRequestError);
      }
      return next(err);
    });
};

export const dislikeCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError('Карточка с указанным _id не найдена');
        return next(notFoundError);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const badRequestError = new BadRequestError('Переданы некорректные данные для снятия лайка');
        return next(badRequestError);
      }
      return next(err);
    });
};
