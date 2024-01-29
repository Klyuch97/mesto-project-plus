import { Request, Response } from 'express';
import card from '../models/card'

export interface RequestOwner extends Request {
  user?: {
    _id: string;
  };
}


export const createCard = (req: RequestOwner, res: Response) => {
  //console.log(req.user._id); // _id будет доступен
  const { link, name } = req.body;
  const owner = req.user?._id;

  return card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).json({ message: 'Произошла ошибка' });
    });
};

export const getCards = (req: Request, res: Response) => {
  return card.find({})
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return card.findByIdAndDelete(cardId)
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}