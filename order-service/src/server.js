import express from "express";
import { Server } from "http";
import orderRouter from "./routes/orderRoutes.js";
import { errorConverter, errorHandler } from "./middleware/index.js";
import { connectDB } from "./database/index.js";
import config from "./config/config.js";
import consumeOrderEvents from "./events/consumer.js";
import cookieParser from "cookie-parser";

const app = express();
let server = Server;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/order", orderRouter);
app.use(errorConverter);
app.use(errorHandler);

connectDB();

server = app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT}`);
});

app.get("/api/health", (req, res) => res.sendStatus(200));

await consumeOrderEvents();

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
