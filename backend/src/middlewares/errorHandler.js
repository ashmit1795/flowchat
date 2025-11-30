import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, next) {
    try {
        if (err instanceof ApiError) {
            console.error(`API Error: ${err.message}`, err.details);
            return res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message, err.details));
        }
        console.error(err);
        return res.status(500).json(new ApiResponse(500, "Server error", { error: err.message }));
    } catch (error) {
        console.error("Error in errorHandler middleware:", error);
        next(error);
    }
}