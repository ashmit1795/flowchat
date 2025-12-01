import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", protectRoute, authController.logout);

export { authRouter };