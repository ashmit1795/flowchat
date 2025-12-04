import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { loginSchema, signupSchema, onboardSchema, validate } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/signup",validate(signupSchema), authController.signup);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/logout", protectRoute, authController.logout);
authRouter.post("/onboard", protectRoute, validate(onboardSchema), authController.onboard);
authRouter.get("/me", protectRoute, authController.getMe);

export { authRouter };