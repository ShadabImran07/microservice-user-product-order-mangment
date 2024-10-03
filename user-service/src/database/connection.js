import mongoose from "mongoose";
import config from "../config/config.js";

export const connectDB = async () => {
	try {
		console.info("Connecting to database..." + config.MONGO_URI);
		await mongoose.connect(config.MONGO_URI, {
			dbName: "users",
		});
		console.info("Database connected");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
