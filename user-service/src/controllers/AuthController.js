import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/index.js";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils/index.js";
import config from "../config/config.js";

import { v4 as uuidv4 } from "uuid";

import {
	publishMessageRegister,
	publishMessageUpdate,
} from "../events/producer.js";

const jwtSecret = config.JWT_SECRET;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
	Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
	expires: expirationDate,
	secure: false,
	httpOnly: true,
};

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) {
			throw new ApiError(400, "User already exists!");
		}

		const user = await User.create({
			userId: uuidv4(),
			name,
			email,
			password: await encryptPassword(password),
		});

		const userData = {
			userId: user.userId,
			name: user.name,
			email: user.email,
		};
		await publishMessageRegister(userData);

		return res.json({
			status: 200,
			message: "User registered successfully!",
			data: userData,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getAllUser = async (req, res) => {
	try {
		const userExists = await User.find({}, { _id: 0 });
		if (!userExists) {
			throw new ApiError(400, "User not exists!");
		}

		return res.json({
			status: 200,
			message: "Users fetch successfully!",
			data: userExists,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const userExists = await User.findOne({ userId: id }, { _id: 0 });
		if (!userExists) {
			throw new ApiError(400, "User not exists!");
		}

		return res.json({
			status: 200,
			message: "Users fetch successfully!",
			data: userExists,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const createSendToken = async (user, res) => {
	const { name, email, userId } = user;
	const token = jwt.sign({ name, email, userId }, jwtSecret, {
		expiresIn: "1d",
	});
	if (config.env === "production") cookieOptions.secure = true;
	res.cookie("jwt", token, cookieOptions);

	return token;
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select("+password");
		if (!user || !(await isPasswordMatch(password, user.password))) {
			throw new ApiError(400, "Incorrect email or password");
		}

		const token = await createSendToken(user, res);

		return res.json({
			status: 200,
			message: "User logged in successfully!",
			token,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const updateProfile = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const {
			userId,
			email: currentEmail,
			password: currentPassword,
			name: currentName,
		} = req.user;

		// Check if the email is already taken by another user
		if (email && email !== currentEmail) {
			const emailExists = await User.findOne({ email });
			if (emailExists && emailExists.userId !== userId) {
				return res.status(400).json({
					status: 400,
					message: "Email already taken!",
				});
			}
		}

		// Prepare updated profile data only for changed fields
		const updatedProfileData = {
			email: email || currentEmail,
			password: password ? await encryptPassword(password) : currentPassword,
			name: name || currentName,
		};

		// Update the user profile
		const updatedProfile = await User.findOneAndUpdate(
			{ userId },
			updatedProfileData,
			{ new: true }
		);

		// Emit the profile update event
		await publishMessageUpdate(updatedProfile);

		// Send a successful response
		return res.status(200).json({
			status: 200,
			message: "User profile updated successfully!",
			data: updatedProfile,
		});
	} catch (error) {
		// Send error response with proper status
		return res.status(500).json({
			status: 500,
			message: error.message || "Internal Server Error",
		});
	}
};

export default {
	register,
	login,
	updateProfile,
	getAllUser,
	getUserById,
};
