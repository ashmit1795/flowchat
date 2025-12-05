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
        const user = await User.findById(userId).populate("friends", "-friends -isOnboarded -password -email");
        if (!user) {
            throw new ApiError("User not found");
        }
        return user.friends;
    }

    async sendFriendRequest(senderId, receiverId) {
        // Prevent sending friend request to oneself
        if (senderId.toString() === receiverId.toString()) {
            throw new ApiError(400, "You cannot send a friend request to yourself");
        }

        // Check if receiver exists and is onboarded
        const receiver = await User.findById(receiverId);
        if (!receiver || !receiver.isOnboarded) {
            throw new ApiError(404, "Receiver user not found");
        }

        // Check if they are already friends
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

        const createdRequest = await FriendRequest.findById(friendRequest._id)
            .populate("sender", "fullName ")
            .populate("receiver", "fullName ");

        // Return the created friend request
        return createdRequest;
    }

    async acceptFriendRequest(userId, requestId) {
        // Validate friend request existence and ownership
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) {
            throw new ApiError(404, "Friend request not found");
        }

        if(friendRequest.status !== "pending") {
            throw new ApiError(400, `Cannot accept a friend request with status: ${friendRequest.status}`);
        }

        // Ensure the user is the receiver of the friend request
        if(friendRequest.receiver.toString() !== userId.toString()) {
            throw new ApiError(403, "You are not authorized to accept this friend request");
        }

        // Update friend request status to accepted
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to the other's friends list
        const sender = await User.findById(friendRequest.sender);
        const receiver = await User.findById(friendRequest.receiver);

        if (!sender || !receiver) {
            throw new ApiError(404, "Sender not found");
        }

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        return friendRequest;
    }

    async getMyFriendRequests(userId) {
        const pendingFriendRequests = await FriendRequest.find({
            receiver: userId,
            status: "pending"
        })
            .populate("sender", "fullName avatarUrl nativeLanguage learningLanguages");
        
        const acceptedFriendRequest = await FriendRequest.find({
            sender: userId,
            status: "accepted"
        })
            .populate("receiver", "fullName avatarUrl");
        
        const sentFriendRequests = await FriendRequest.find({
            sender: userId,
            status: "pending"
        })
            .populate("receiver", "fullName avatarUrl nativeLanguage learningLanguages");
        
        return { received: pendingFriendRequests, accepted: acceptedFriendRequest, sent: sentFriendRequests };
    }
}

export const userService = new UserService();

// TODO: Show Mutual Friends