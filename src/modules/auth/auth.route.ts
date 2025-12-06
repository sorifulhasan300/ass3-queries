import { Router } from "express";
import { Controller } from "./auth.controller";

const router = Router();

router.post("/signup", Controller.signUp);
router.post("/signin", Controller.signIn);

export const userRouter = router;
