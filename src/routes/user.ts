import { Router } from "express";
import { getUsers, getUserById, UpdateUserInfo, UpdateAvatar, GetCurrentUser } from "../controllers/user";



const router = Router();

router.get('/', getUsers);
router.get('/me', GetCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', UpdateUserInfo);
router.patch('/me/avatar', UpdateAvatar);

export default router;