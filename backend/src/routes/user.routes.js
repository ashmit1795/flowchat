import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.get("/", userController.getRecommendedUsers);

export default userRouter;
