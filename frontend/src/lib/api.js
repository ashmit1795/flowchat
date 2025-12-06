import { axiosInstance } from "../config/axios";

export const signUp = async (signupData) => {
    console.log("Signing up with data:", signupData);
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const getAuthUser = async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
}