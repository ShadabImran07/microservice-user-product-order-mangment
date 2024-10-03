import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import { schema } from "./schema/graphQlSchema.js";
import axios from "axios";
import config from "./config/config.js";
import jwt from "jsonwebtoken";
import { ruruHTML } from "ruru/server";
import { ApiError } from "../src/utils/index.js";
import cookieParser from "cookie-parser";

const jwtSecret = config.JWT_SECRET;

const userServiceUrl = "http://user:9000";
const orderServiceUrl = "http://order:9002";
const productServiceUrl = "http://product:9001";

const root = {
	//user specific query and mutation functions
	users: async (parent, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.get(userServiceUrl + "/api/user");
		return res.data;
	},
	user: async ({ id }) => {
		const res = await axios.get(`${userServiceUrl}/api/user/${id}`);
		return res.data;
	},

	loginUser: async ({ email, password }) => {
		try {
			// Send login request to the REST API
			const response = await axios.post(`${userServiceUrl}/api/user/login`, {
				email,
				password,
			});
			return response.data;
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Login failed. Please check your credentials.";

			return {
				status: error.response?.status || 500, // Use the error response status or default to 500
				message: errorMessage,
			};
		}
	},

	registerUser: async ({ name, email, password }) => {
		const res = await axios.post(`${userServiceUrl}/api/user/register`, {
			name,
			password,
			email,
		});
		return res.data;
	},

	//product specific query and mutation functions

	products: async (parent, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.get(`${productServiceUrl}/api/product`);
		return res.data;
	},
	product: async ({ id }, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.get(`${productServiceUrl}/api/product/${id}`);
		return res.data;
	},

	createProduct: async ({ name, price, type }, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.post(`${productServiceUrl}/api/product/create`, {
			name,
			price,
			type,
		});
		return res.data;
	},

	// order specific query and mutation functions

	orders: async (parent, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.get(`${orderServiceUrl}/api/order`);
		return res.data;
	},

	order: async ({ id }, context) => {
		if (!context.user) {
			throw new Error("Unauthorized");
		}
		const res = await axios.get(`${orderServiceUrl}/api/order/${id}`);
		return res.data;
	},

	placeOrder: async (
		{ userId, productId, qty, price, paymentMethod },
		context
	) => {
		// Ensure the user is authenticated
		if (!context.user) {
			throw new Error("Unauthorized");
		}

		const res = await axios.post(`${orderServiceUrl}/api/order/create`, {
			userId,
			productId,
			qty,
			paymentMethod,
			price,
		});

		return res.data;
	},
};

// Middleware to verify JWT and add user info to context
export const userVerify = (req, res, next) => {
	try {
		let token;
		const cookies = req.cookies;
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith("Bearer ")) {
			token = authHeader.split(" ")[1];
		} else if (cookies && cookies.jwt) {
			console.log("cookies", JSON.stringify(cookies));
			token = cookies.jwt;
		}

		// If no token is found, the user is unauthenticated
		if (!token) {
			req.user = null;
		} else {
			// Verify the token (whether from cookies or header)
			const decoded = jwt.verify(token, jwtSecret);

			// Add user info to the request object
			req.user = {
				userId: decoded.userId,
				email: decoded.email,
				createdAt: new Date(decoded.iat * 1000),
				updatedAt: new Date(decoded.exp * 1000),
				name: decoded.name,
			};
		}
		next(); // Proceed to the next middleware or route handler
	} catch (err) {
		// Token verification failed, set user as null and respond with an error
		console.error("Token verification error:", err.message);
		req.user = null;
	}
};

const app = express();

app.use(cookieParser());

// Apply the JWT authentication middleware
app.use(userVerify);

// GraphQL endpoint

app.all(
	"/graphql",
	createHandler({
		schema: schema,
		rootValue: root,
		context: (req) => ({
			user: req.raw.user,
		}),
	})
);

app.get("/api/health", (req, res) => res.sendStatus(200));

app.get("/", (_req, res) => {
	res.type("html");
	res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.listen(4000, () => {
	console.log("GraphQL Gateway listening on port 4000");
});
