import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

export const protectRoute = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
        return next(new ApiError(401, "Unauthorized: No token provided"));
    }
    try {
        const decodedToken = jwt.verify(accessToken, JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.findById(userId).select("-password");
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}