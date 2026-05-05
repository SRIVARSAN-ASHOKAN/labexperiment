
import express from "express";

import cors from "cors";
import formRouter from "./routes/form.router.js";
import connectDB from "./config/db.config.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", formRouter);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});