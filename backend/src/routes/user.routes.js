import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.get("/", userController.getRecommendedUsers);
userRouter.get("/friends", userController.getMyFriends);
userRouter.post("/friend-request/:id", userController.sendFriendRequest);
userRouter.put("/friend-request/:requestId/accept", userController.acceptFriendRequest);


export default userRouter;
