import { z } from "zod";
import ApiError from "../utils/ApiError.js";

const signupSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	gender: z.enum(["male", "female", "other"], "Gender must be male, female, or other"),
});

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});

const onboardSchema = z.object({
	fullName: z.string("Full name is required").min(1, "Full name cannot be empty"),
	bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
	gender: z.enum(["male", "female", "other"], "Gender must be male, female, or other"),
	nativeLanguage: z.string("Native language is required").min(1, "Native language cannot be empty"),
	learningLanguages: z
		.array(
			// transform first, then validate with refine (min is not available after transform)
			z
				.string()
				.transform((s) => String(s ?? "").trim())
				.refine((s) => s.length > 0, { message: "Language cannot be empty" })
		)
		.nonempty("At least one learning language is required"),
	location: z.string("Location is required").min(1, "Location cannot be empty"),
});

const updateUserSchema = z.object({
	fullName: z.string().min(1, "Full name cannot be empty").optional(),
	bio: z.string().max(200, "Bio must be at most 200 characters").optional(),
	gender: z.enum(["male", "female", "other"], "Gender must be male, female, or other").optional(),
	nativeLanguage: z.string().min(1, "Native language cannot be empty").optional(),
	learningLanguages: z
		.array(
			// transform first, then validate with refine (min is not available after transform)
			z
				.string()
				.transform((s) => String(s ?? "").trim())
				.refine((s) => s.length > 0, { message: "Language cannot be empty" })
		)
		.nonempty("At least one learning language is required")
		.optional(),
	location: z.string().min(1, "Location cannot be empty").optional(),
});

// middleware factory for Express
const validate = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);

	if (!result.success) {
		// removed noisy console.log(result)
		const errors = result.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));

		return next(new ApiError(400, "Validation failed", errors));
	}

	req.body = result.data;
	next();
};

export { signupSchema, loginSchema, onboardSchema, updateUserSchema, validate };
