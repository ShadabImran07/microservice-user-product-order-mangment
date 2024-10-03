import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { userVerify } from "../middleware/index.js";

const userRouter = Router();

userRouter.post("/register", AuthController.register);
userRouter.post("/login", AuthController.login);
userRouter.post("/update", userVerify, AuthController.updateProfile);
userRouter.get("/", AuthController.getAllUser);
userRouter.get("/:id", AuthController.getUserById);

export default userRouter;
