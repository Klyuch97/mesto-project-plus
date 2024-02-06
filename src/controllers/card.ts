import { NextFunction, Request, Response } from 'express';
import card from '../models/card'
import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_SERVER_ERROR, HTTP_STATUS_CONFLICT, STATUS_OK } from '../errors/errors';


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
        return res.status(ERROR_CODE_NOT_FOUND).json({ message: 'Карточка с указанным _id не найдена' });
      }
      if (card.owner.toString() !== userId) {
        return res.status(HTTP_STATUS_CONFLICT).json({ message: 'У вас нет прав на удаление этой карточки' });
      }

      return card.deleteOne({ _id: cardId })
        .then(() => {
          res.status(STATUS_OK).json({ message: 'Карточка успешно удалена' });
        })
        .catch((error: any) => {
          return res.status(ERROR_CODE_SERVER_ERROR).json({ message: 'Произошла ошибка на сервере' });
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
    { new: true },).orFail(() => {
      const error = new Error();
      error.name = 'CardNotFoundError';
      throw error;
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      next(err)
    });
}


export const dislikeCard = (req: RequestOwner, res: Response, next: NextFunction) => {
  const id = req.user?._id;
  const { cardId } = req.params;

  return card.findByIdAndUpdate(cardId,
    { $pull: { likes: id } },
    { new: true },).orFail(() => {
      const error = new Error();
      error.name = 'CardNotFoundError';
      throw error;
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(err)
    })
}