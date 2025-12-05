import axios from "axios";
import ENV from "./env";

export const axiosInstance = axios.create({
    baseURL: ENV.BASE_URL,
    withCredentials: true, // Include cookies in requests
});
