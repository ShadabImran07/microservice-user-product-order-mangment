import express from "express";
import { Server } from "http";
import userRouter from "./routes/authRoutes.js";
import { errorConverter, errorHandler } from "./middleware/index.js";
import { connectDB } from "./database/index.js";
import config from "../src/config/config.js";
import consumeMessages from "./events/consumer.js";
import cookieParser from "cookie-parser";

const app = express();
let server = Server;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use(errorConverter);
app.use(errorHandler);

connectDB();

server = app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT}`);
});

app.get("/api/health", (req, res) => res.sendStatus(200));

await consumeMessages();

const exitHandler = () => {
	if (server) {
		server.close(() => {
			console.info("Server closed");
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error) => {
	console.error(error);
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
