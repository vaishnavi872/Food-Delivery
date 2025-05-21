import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";

const userRouter = express.Router();

// ✅ Register route
userRouter.post("/register", registerUser);

// ✅ Login route (using controller function)
userRouter.post("/login", loginUser);

export default userRouter;

