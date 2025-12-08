import { axiosInstance } from "../config/axios";

export const signUp = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data?.data?.user;
}

export const logout = async () => {
	const response = await axiosInstance.post("/auth/logout");
	return response.data;
};

export const getAuthUser = async () => {
    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        return null;
    }
}

export const completeOnboarding = async (onboardData) => { 
    const response = await axiosInstance.post("/auth/onboard", onboardData);
    return response.data;
}

export const getMyFriends = async () => {
    const response = await axiosInstance.get("/user/friends");
    return response.data.data.friends;
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/user");
    return response.data.data.users;
}

export const getMyFriendRequests = async () => {
    const response = await axiosInstance.get("/user/friend-requests");
    return response.data.data.friendRequests;
}

export const sentFriendRequests = async () => {
    const friendRequests = await getMyFriendRequests();
    return friendRequests.sent;
}

export const receivedFriendRequests = async () => {
    const friendRequests = await getMyFriendRequests();
    return friendRequests.received;
}

export const acceptedFriendRequests = async () => {
    const friendRequests = await getMyFriendRequests();
    return friendRequests.accepted;
}

export const sendFriendRequest = async (friendId) => {
    const response = await axiosInstance.post(`/user/friend-request/${friendId}`);
    return response.data.data.friendRequest;
}

export const acceptFriendRequest = async (requestId) => {
    const response = await axiosInstance.put(`/user/friend-request/${requestId}/accept`);
    return response.data.data.friendRequest;
}