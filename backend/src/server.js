import { app } from "./app.js";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.on("error", (err) => {
        console.error("Server error:", err, err.message);
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to start server due to database connection error:", error);
});

export default app;