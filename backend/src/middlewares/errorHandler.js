import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export default function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message, err.details));
    }
    console.error(err);
    return res.status(500).json(new ApiResponse(500, "Server error", { error: err.message }));
}