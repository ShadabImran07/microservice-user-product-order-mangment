import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
	{
		orderId: {
			type: String,
			required: true,
		},
		productId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ["cash_on_delivery", "debit_card", "emi"],
			required: true,
			default: "cash_on_delivery",
		},
		orderStatus: {
			type: String,
			enum: ["ordered", "packed", "shipped", "delivered"],
			required: true,
			default: "ordered",
		},
		orderAmt: {
			type: Number,
			trim: false,
			required: [true, "Price must be provided"],
		},
	},
	{
		timestamps: true,
	}
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
