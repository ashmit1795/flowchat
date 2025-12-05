import { config } from "dotenv";

config();

export const { PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, JWT_EXPIRES_IN, STREAM_API_KEY, STREAM_API_SECRET, CLIENT_URL } = process.env;