import { Request, Response } from 'express';
import card from '../models/card'

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
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).json({ message: 'Переданы некорректные данные при создании карточки' });
      }
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

export const getCards = (req: Request, res: Response) => {
  return card.find({})
  .populate(['owner','likes'])
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return card.findByIdAndDelete(cardId)
    .then(card => {
      res.send({ data: card });
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).json({ message: 'Карточка с указанным _id не найдена' });
      }

      res.status(500).send({ message: 'Произошла ошибка' })
    })
}

export const likeCard = (req: RequestOwner, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },)
    .populate(['owner','likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Переданы некорректные данные для постановки лайка." });
      } else {
        res.status(500).json({ message: 'Произошла ошибка' });
      }
    });
}


export const dislikeCard = (req: RequestOwner, res: Response) => {
  const id = req.user?._id;

  return card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: id } },
    { new: true },)
    .populate(['owner','likes'])
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Переданы некорректные данные для снятия лайка." });
      } else {
        res.status(500).json({ message: 'Произошла ошибка' });
      }
    });
}