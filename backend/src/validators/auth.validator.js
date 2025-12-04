import { z } from "zod";
import ApiError from "../utils/ApiError.js";

const signupSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	gender: z.enum(["male", "female", "other"], "Gender must be male, female, or other")
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
});

// middleware factory for Express
const validate = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);

	if (!result.success) {
		const errors = result.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));

		return next(new ApiError(400, "Validation failed", errors));
	}

	req.body = result.data;
	next();
};


export { signupSchema, loginSchema, validate };