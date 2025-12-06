import { NODE_ENV } from "../config/env.js";
import { authService } from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

class AuthController {
    async signup(req, res, next) { 
        const { fullName, email, password, gender } = req.body;
        try {
            const { user: createdUser, accessToken } = await authService.signup({ fullName, email, password, gender });

            // TODO: Create an account in Stream also
            
            res.cookie("accessToken", accessToken, {
                httpOnly: true, // Mitigates XSS attacks
                secure: NODE_ENV === "production",
                sameSite: "strict", // Mitigates CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.status(201).json(new ApiResponse(201, "User registered successfully", { user: createdUser }));
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) { 
        const { email, password } = req.body;
        try { 
            // Basic validation
            if (!email || !password) {
                throw new ApiError(400, "Email and password are required");
            }

            if (!emailRegex.test(email)) {
				throw new ApiError(400, "Invalid email format");
            }
            
            const { user, accessToken } = await authService.login(email, password);

            res.cookie("accessToken", accessToken, {
                httpOnly: true, // Mitigates XSS attacks
                secure: NODE_ENV === "production",
                sameSite: "strict", // Mitigates CSRF attacks
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(200).json(new ApiResponse(200, "User logged in successfully", { user }));
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                throw new ApiError(401, "Unauthorized");
            }
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: NODE_ENV === "production",
                sameSite: "strict"
            });
            res.status(200).json(new ApiResponse(200, "User logged out successfully"));
        } catch (error) {
            next(error);
        }
    }

    async onboard(req, res, next) {
        try {
            const user = req.user;
            const { fullName, bio, gender, nativeLanguage, learningLanguage, location } = req.body;

            const updatedUser = await authService.onboard(user._id, {
                fullName, bio, gender, nativeLanguage, learningLanguage, location
            })
            res.status(200).json(new ApiResponse(200, "User onboarded successfully", { user: updatedUser }));
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = req.user;
            const updateData = req.body;
            const updatedUser = await authService.updateUser(user._id, updateData);
            res.status(200).json(new ApiResponse(200, "User updated successfully", { user: updatedUser }));
        } catch (error) {
            next(error);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                throw new ApiError(401, "Unauthorized");
            }
            res.status(200).json(new ApiResponse(200, "User fetched successfully", { user }));
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();