import { Router } from "express";
import { getUsers, createUser, getUserById, UpdateUserInfo } from "../controllers/user";



const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', UpdateUserInfo)

export default router;