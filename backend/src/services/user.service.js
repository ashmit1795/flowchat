import User from "../../models/user.model.js";
import ApiError from "../utils/ApiError.js";

class UserService{
    async getRecommendedUsers(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError("User not found");
        }

        // TODO: Implement a more sophisticated recommendation aggregation pipeline
        const recommendedUsers = await User.find({ 
            $and: [
                {
                    _id: {
                        $ne: user._id
                    }
                },
                {
                    _id: {
                        $nin: user.friends
                    }
                },
                {
                    isOnboarded: true
                }
            ]
        });
        return recommendedUsers;
    }
}

export const userService = new UserService();