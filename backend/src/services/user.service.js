import FriendRequest from "../../models/friendRequest.model.js";
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

    async getMyFriends(userId) {
        const user = await User.findById(userId).populate("friends", "-password -email");
        console.log(user)
        if (!user) {
            throw new ApiError("User not found");
        }
        return user.friends;
    }

    async sendFriendRequest(senderId, receiverId) {
        // Prevent sending friend request to oneself
        if (senderId === receiverId) {
            throw new ApiError(400, "You cannot send a friend request to yourself");
        }

        // Check if receiver exists and is onboarded
        const receiver = await User.findById(receiverId);
        if (!receiver || !receiver.isOnboarded) {
            throw new ApiError(404, "Receiver user not found");
        }

        // Check if they are already friends
        console.log("Receiver's Friends:", receiver.friends, "Sender ID:", senderId);
        if(receiver.friends.includes(senderId)) {
            throw new ApiError(400, "You are already friends with this user");
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ],
            status: "pending"
        });
        if (existingRequest) {
            throw new ApiError(400, "A pending friend request already exists between these users");
        }

        // Create new friend request
        const friendRequest = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId
        });

        // Return the created friend request
        return friendRequest;
    }
}

export const userService = new UserService();

// TODO: Show Mutual Friends