import mongoose, { Schema } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			required: [true, "Name must be provided"],
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			validate: [validator.isEmail, "Please provide a valid email."],
		},
		password: {
			type: String,
			trim: false,
			required: [true, "Password must be provided"],
			minlength: 8,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", UserSchema);
export default User;
