import { Router } from "express";
import cardRouter from "./card";
import userRouter from "./user";

const router = Router();

router.use('/cards', cardRouter);
router.use('/users', userRouter);

export default router;