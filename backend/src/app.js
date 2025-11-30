import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use("/api/auth", authRouter);

export { app };
