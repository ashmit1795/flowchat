import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../src/config/env.js";

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			enum: ["male", "female", "other"],
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		bio: {
			type: String,
			default: "",
		},
		avatarUrl: {
			type: String,
			default: "",
		},
		nativeLanguage: {
			type: String,
			default: "",
		},
		learningLanguages: [String],
		location: {
			type: String,
			default: "",
		},
		isOnboarded: {
			type: Boolean,
			default: false,
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { userId: this._id, email: this.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

const User = mongoose.model("User", userSchema);

export default User;