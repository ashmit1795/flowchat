import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';
import pkg from "jsonwebtoken";
import { th } from 'zod/locales';
const { JsonWebTokenError } = pkg;

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized: No token provided")
        }

        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.findById(userId).select("-password");
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return next(new ApiError(401, "Unauthorized: Invalid token", error.message));
        }
        next(error);
    }
}