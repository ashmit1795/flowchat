import User from "../../models/user.model.js";
import { upsertStreamUser } from "../config/stream.js";
import ApiError from "../utils/ApiError.js";

const FEMALE_AVATARS = [
	71, 74, 57, 84, 64, 100, 83, 85, 66, 78, 65, 63, 81, 99, 90, 58, 95, 55, 68, 61, 89, 92, 54, 80, 79, 70, 97, 86, 88, 98, 73, 94, 87, 96, 72, 77,
	56, 82, 69, 62, 93, 76, 59, 91, 53, 51, 67, 75, 60, 52,
];

const MALE_AVATARS = [
	13, 28, 38, 36, 39, 3, 23, 45, 42, 49, 4, 27, 6, 29, 12, 44, 17, 33, 40, 20, 35, 24, 22, 8, 18, 10, 41, 1, 47, 34, 2, 16, 32, 50, 30, 26, 15, 5,
	31, 21, 37, 9, 48, 7, 25, 43, 19, 11, 14, 46,
];

class AuthService {
	async signup(userData) {
		const existingUser = await User.findOne({ email: userData.email });
		if (existingUser) {
			throw new ApiError(409, "User with this email already exists");
		}

		// Generate random avatar URL
		let randomAvatarUrl;
		let randomAvatarId;
        if (userData.gender === "male") {
            randomAvatarId = MALE_AVATARS[Math.floor(Math.random() * MALE_AVATARS.length)];
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		} else if (userData.gender === "female") {
			randomAvatarId = FEMALE_AVATARS[Math.floor(Math.random() * FEMALE_AVATARS.length)];
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		} else {
			randomAvatarId = Math.floor(Math.random() * 100) + 1;
			randomAvatarUrl = `https://avatar.iran.liara.run/public/${randomAvatarId}.png`;
		}

		const newUser = await User.create({
			email: userData.email,
			fullName: userData.fullName,
			password: userData.password,
            avatarUrl: randomAvatarUrl,
            gender: userData.gender
		});

		// Extra check
		const createdUser = await User.findById(newUser._id).select("-password");
		if (!createdUser) {
			throw new ApiError(500, "User creation failed");
		}

		const accessToken = createdUser.generateAccessToken();

		await upsertStreamUser({
			id: createdUser._id.toString(),
			name: createdUser.fullName.toString(),
			image: createdUser.avatarUrl.toString() || ""
		});

		return { user: createdUser, accessToken };
	}

	async login(email, password) {
		const user = await User.findOne({ email });
		if (!user || !(await user.isPasswordCorrect(password))) {
			throw new ApiError(401, "Invalid email or password");
		}
		const accessToken = user.generateAccessToken();
		const userWithoutPassword = await User.findById(user._id).select("-password");
		return { user: userWithoutPassword, accessToken };
	}

	async onboard(userId, onboardData) { 
		// Check if user has already onboarded
		const user = await User.findById(userId);
		if (user.isOnboarded) {
			throw new ApiError(400, "User has already completed onboarding");
		}
		const updatedUser = await User.findByIdAndUpdate(userId, {
			fullName: onboardData.fullName,
			bio: onboardData.bio || "",
			gender: onboardData.gender,
			nativeLanguage: onboardData.nativeLanguage || "",
			learningLanguages: onboardData.learningLanguages || [],
			location: onboardData.location || "",
			isOnboarded: true
		}, { new: true });

		if(!updatedUser) {
			throw new ApiError(500, "Onboarding failed");
		}

		// TODO: send welcome notification or email here
		// TODO: UPDATE THE USER INFO IN STREAM
		await upsertStreamUser({
			id: updatedUser._id.toString(),
			name: updatedUser.fullName.toString(),
			image: updatedUser.avatarUrl.toString() || ""
		});

		return updatedUser;
	}
}

export const authService = new AuthService();
