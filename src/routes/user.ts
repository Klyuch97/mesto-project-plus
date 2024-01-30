import { Router } from "express";
import { getUsers, createUser, getUserById, UpdateUserInfo, UpdateAvatar } from "../controllers/user";



const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', UpdateUserInfo);
router.patch('/me/avatar',UpdateAvatar);

export default router;