import bcrypt from "bcryptjs";

class ApiError extends Error {
	statusCode;
	isOperational;

	constructor(statusCode, message, isOperational = true, stack = "") {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

const encryptPassword = async (password) => {
	const encryptedPassword = await bcrypt.hash(password, 12);
	return encryptedPassword;
};

const isPasswordMatch = async (password, userPassword) => {
	const result = await bcrypt.compare(password, userPassword);
	return result;
};

export { ApiError, encryptPassword, isPasswordMatch };
