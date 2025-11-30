import express from "express";
import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/auth", authRouter);
