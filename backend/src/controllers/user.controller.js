import { userService } from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";

class UserController{
    async getRecommendedUsers(req, res, next) {
        try {
            const user = req.user;
            const recommendedUsers = await userService.getRecommendedUsers(user._id);
            res.status(200).json(new ApiResponse(200, "Recommended users fetched successfully", { users: recommendedUsers }));
        } catch (error) {
            next(error);
        }
    }

    async getMyFriends(req, res, next) {
        try {
            const user = req.user;
            const friends = await userService.getMyFriends(user._id);
            res.status(200).json(new ApiResponse(200, "Friends fetched successfully", { friends }));
        } catch (error) {
            next(error);
        }
    }

    async sendFriendRequest(req, res, next) {
        try {
            const user = req.user;
            const friendId = req.params.id;
            await userService.sendFriendRequest(user._id, friendId);
            res.status(200).json(new ApiResponse(200, "Friend request sent successfully"));
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();