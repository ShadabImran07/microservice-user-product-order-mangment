import { ApiError } from "../utils/index.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

const jwtSecret = config.JWT_SECRET;

export const errorConverter = (err, req, res, next) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode =
			error.statusCode ||
			(error instanceof Error
				? 400 // Bad Request
				: 500); // Internal Server Error
		const message =
			error.message ||
			(statusCode === 400 ? "Bad Request" : "Internal Server Error");
		error = new ApiError(statusCode, message, false, err.stack.toString());
	}
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	let { statusCode, message } = err;
	if (process.env.NODE_ENV === "production" && !err.isOperational) {
		statusCode = 500; // Internal Server Error
		message = "Internal Server Error";
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	};

	if (process.env.NODE_ENV === "development") {
		console.error(err);
	}

	res.status(statusCode).json(response);
	next();
};

export const userVerify = (req, res, next) => {
	try {
		// Check for the Authorization header
		const authHeader = req.headers.authorization;
		let token;

		if (authHeader && authHeader.startsWith("Bearer ")) {
			// If Bearer token exists, extract the token from the Authorization header
			token = authHeader.split(" ")[1];
		} else if (req.cookies && req.cookies.jwt) {
			// Fallback to cookie if Bearer token is not found
			token = req.cookies.jwt;
		}

		if (!token) {
			return next(
				new ApiError(401, "Missing token in cookies or Authorization header")
			);
		}

		// Verify the token
		const decoded = jwt.verify(token, jwtSecret);

		// Add user data to the request object
		req.user = {
			userId: decoded.userId,
			email: decoded.email,
			createdAt: new Date(decoded.iat * 1000),
			updatedAt: new Date(decoded.exp * 1000),
			name: decoded.name,
		};

		// Continue to the next middleware or route
		return next();
	} catch (error) {
		console.error("Token verification error:", error);
		return next(new ApiError(401, "Invalid or expired token"));
	}
};
