import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";


if (!MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined in environment variables");
}

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(MONGODB_URI);
		console.log("Database connected successfully:", connectionInstance.connection.host);
	} catch (error) {
		console.log("Database connection error:", error);
		throw new Error("Database connection failed");
	}
};

export default connectDB;

