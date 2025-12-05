// backend/src/app.js
import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { CLIENT_URL, NODE_ENV } from "./config/env.js";
import { fileURLToPath } from "url";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
	origin: CLIENT_URL,
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check route
app.get("/api", (req, res) => {
	res.status(200).json("Welcome to FlowChat API");
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Serve static files only if build exists (production)
if (NODE_ENV === "production") {
	const staticDir = path.join(__dirname, "../../frontend/dist");
	console.log("ENV:", NODE_ENV, "staticDir:", staticDir);

	if (fs.existsSync(staticDir)) {
		app.use(express.static(staticDir));

		// Middleware: serve index.html for SPA GET requests (no path-to-regexp)
		const indexPath = path.join(staticDir, "index.html");
		app.use((req, res, next) => {
			if (req.method !== "GET") return next();
			if (req.path.startsWith("/api/")) return next();
			// prefer only HTML-accepting requests
			if (!req.accepts || !req.accepts("html")) return next();
			if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
			return next();
		});
	} else {
		console.warn("Static dir not found:", staticDir);
	}
}

// Error handler last
app.use(errorHandler);

export { app };
