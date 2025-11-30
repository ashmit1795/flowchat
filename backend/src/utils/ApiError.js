class ApiError extends Error {
    constructor(statusCode = 500, message = "Server error", details = null) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;