import express, { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import chatController from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.get("/token", protectRoute, chatController.getStreamChatToken);

export { chatRouter };
