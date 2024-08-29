import express from "express";
import {
  loginUser,
  registerUser,
  googleUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/googleauth", googleUser);

export default userRouter;
