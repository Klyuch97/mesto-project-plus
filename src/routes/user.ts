import { Router } from 'express';
import {
  getUsers, getUserById, updateUserInfo, updateAvatar, getCurrentUser,
} from '../controllers/user';
import { updateAvatarValidator, updateUserInfoValidator, getUserByIdValidator } from '../validation/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserByIdValidator, getUserById);
router.patch('/me', updateUserInfoValidator, updateUserInfo);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

export default router;
