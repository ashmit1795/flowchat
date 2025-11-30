import { NODE_ENV } from "../config/env.js";
import { authService } from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

class AuthController {
    async signup(req, res, next) { 
        const { fullName, email, password } = req.body;
        try {
            // Basic validation
            if (!fullName || !email || !password) {
                return res.status(400).json(new ApiResponse(400, "Full name, email, and password are required"));
            }

            if(password.length < 6) {
                return res.status(400).json(new ApiResponse(400, "Password must be at least 6 characters long"));
            }

            if (!emailRegex.test(email)) {
                return res.status(400).json(new ApiResponse(400, "Invalid email format"));
            }

            const { user: createdUser, accessToken } = await authService.signup({ fullName, email, password });

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

    async login(req, res) { 

    }

    async logout(req, res) {
    
    }
}

export const authController = new AuthController();