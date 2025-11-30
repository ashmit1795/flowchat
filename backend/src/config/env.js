import { config } from "dotenv";

config();

export const { PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, JWT_EXPIRES_IN } = process.env;