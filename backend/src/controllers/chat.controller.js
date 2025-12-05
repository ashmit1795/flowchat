import { generateStreamToken } from "../config/stream.js";
import ApiResponse from "../utils/ApiResponse.js";

class ChatController {
    async getStreamChatToken(req, res, next) {
        try {
            const token = generateStreamToken(req.user._id);

            return res.status(200).json(new ApiResponse(200, "Stream token generated successfully", { token }));
        } catch (error) {
            next(error);
        }
    }
}

const chatController = new ChatController();

export default chatController;