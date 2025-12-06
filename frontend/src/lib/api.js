import { axiosInstance } from "../config/axios";

export const signUp = async (signupData) => {
    console.log("Signing up with data:", signupData);
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}