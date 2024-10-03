import { Order } from "../database/index.js";
import { ApiError } from "../utils/index.js";

import { publishOrderPlaced, publishOrderupdate } from "../events/producer.js";
import { v4 as uuidv4 } from "uuid";

const createOder = async (req, res) => {
	try {
		const { productId, userId, qty, paymentMethod, price } = req.body;
		if (!productId || !userId || !qty || !paymentMethod || !price) {
			throw new ApiError(400, "Missing required fields!");
		}
		const order = await Order.create({
			orderId: uuidv4(),
			productId: productId,
			userId: userId,
			paymentMethod: paymentMethod,
			orderAmt: price,
			quantity: qty,
		});

		const orderData = {
			orderId: order.orderId,
			paymentMethod: order.paymentMethod,
			orderStatus: order.orderStatus,
			productId: order.productId,
			orderAmt: order.orderAmt,
			quantity: order.quantity,
			userId: order.userId,
		};
		await publishOrderPlaced(orderData);

		return res.json({
			status: 200,
			message: "Oder Placed successfully!",
			data: orderData,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getAllOders = async (req, res) => {
	try {
		const orders = await Order.find({}, { _id: 0 });

		return res.json({
			status: 200,
			message: "Order fetch successfully!",
			data: orders,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getOrderById = async (req, res) => {
	try {
		const { id } = req.params;
		const orders = await Order.findOne({ orderId: id }, { _id: 0 });

		return res.json({
			status: 200,
			message: "Order fetch successfully!",
			data: orders,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const updateOrder = async (req, res) => {
	try {
		const { id } = req.params;
		const { orderStatus } = req.body;

		// Check if the product exists
		const orderExists = await Order.findOne({ orderId: id });
		if (!orderExists) {
			return res.status(400).json({
				status: 400,
				message: "Order not found!",
			});
		}

		// Prepare updated product data only for changed fields
		const updatedOrderStatus = {
			orderStatus: orderStatus || orderExists.orderStatus,
		};

		// Update the product
		const updatedOder = await Order.findOneAndUpdate(
			{ orderId: id },
			updatedOrderStatus,
			{ new: true },
			{ _id: 0 }
		);

		await publishOrderupdate(updatedOder);

		// Send a successful response
		return res.status(200).json({
			status: 200,
			message: "order updated successfully!",
			data: updatedOder,
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
	createOder,
	getAllOders,
	updateOrder,
	getOrderById,
};
