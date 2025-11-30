import User from "../../models/user.model.js";
import ApiError from "../utils/ApiError.js";

class AuthService{
    async signup(userData){
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists");
        }
        // Generate random avatar URL
        const randomAvatarId = Math.floor(Math.random() * 100) + 1;
        const randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;

        const newUser = await User.create({
            email: userData.email,
            fullName: userData.fullName,
            password: userData.password,
            avatarUrl: randomAvatarUrl
        });

        // Extra check
        const createdUser = await User.findById(newUser._id).select("-password");
        if (!createdUser) {
            throw new ApiError(500, "User creation failed");
        }

        const accessToken = createdUser.generateAccessToken();

        return { user: createdUser, accessToken };
    }

    async login(email, password){
        const user = await User.findOne({ email });
        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new ApiError(401, "Invalid email or password");
        }
        const accessToken = user.generateAccessToken();
        const userWithoutPassword = await User.findById(user._id).select("-password");
        return { user: userWithoutPassword, accessToken };
    }
}

export const authService = new AuthService();