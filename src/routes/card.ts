import { Router } from 'express';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';
import { CardIdValidator, createCardValidator } from '../validation/validation';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:cardId', CardIdValidator, deleteCard);
router.put('/:cardId/likes', CardIdValidator, likeCard);
router.delete('/:cardId/likes', CardIdValidator, dislikeCard);

export default router;
