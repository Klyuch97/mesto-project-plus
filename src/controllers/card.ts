import { NextFunction, Request, Response } from 'express';
import card from '../models/card'
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

  return card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  return card.find({})
    .populate(['owner', 'likes'])
    .then(card => res.send({ data: card }))
    .catch((err) => next(err));
};

export const deleteCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  card.findById(cardId)
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError("Карточка с указанным _id не найдена");
        return next(notFoundError);
      }
      if (card.owner.toString() !== userId) {
        const statusForbidden = new StatusForbidden("У вас нет прав на удаление этой карточки");
        return next(statusForbidden);
      }

      return card.deleteOne()
        .then(() => {
          res.status(STATUS_OK).json({ message: 'Карточка успешно удалена' });
        })
        .catch((error: any) => {
          //return res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка на сервере' });
          next(error)
        });
    })
    .catch((err) => {
      next(err)
    });
};

export const likeCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  return card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
       const notFoundError = new NotFoundError("Карточка с указанным _id не найдена");
        return next(notFoundError);
      }
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const badRequestError = new BadRequestError("Переданы некорректные данные для поставновки лайка")
        return next(badRequestError);
      }
      next(err)
    });
}


export const dislikeCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  return card.findByIdAndUpdate(cardId,
    { $pull: { likes: id } },
    { new: true },)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError("Карточка с указанным _id не найдена");
         return next(notFoundError);
       }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const badRequestError = new BadRequestError("Переданы некорректные данные для снятия лайка")
        return next(badRequestError);
      }
      next(err)
    })
}