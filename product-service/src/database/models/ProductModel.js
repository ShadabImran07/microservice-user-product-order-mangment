import mongoose, { Schema } from "mongoose";

const PorductSchema = new Schema(
	{
		productId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "Name must be provided"],
			minlength: 4,
		},
		type: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		price: {
			type: Number,
			trim: false,
			required: [true, "Price must be provided"],
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model("Product", PorductSchema);
export default Product;
