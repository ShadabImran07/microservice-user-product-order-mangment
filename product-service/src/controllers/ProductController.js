import { Product } from "../database/index.js";
import { ApiError } from "../utils/index.js";

import {
	publishProductCreated,
	publishProductUpdate,
} from "../events/producer.js";
import { v4 as uuidv4 } from "uuid";

const createProduct = async (req, res) => {
	try {
		const { name, price, type } = req.body;
		const productExists = await Product.findOne({ name });
		if (productExists) {
			throw new ApiError(400, "Product already exists!");
		}

		const product = await Product.create({
			productId: uuidv4(),
			name,
			type,
			price,
		});

		const productData = {
			productId: product.productId,
			name: product.name,
			price: product.price,
			type: product.type,
		};
		await publishProductCreated(productData);

		return res.json({
			status: 200,
			message: "Product registered successfully!",
			data: productData,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getAllProduct = async (req, res) => {
	try {
		const products = await Product.find({}, { _id: 0 });

		return res.json({
			status: 200,
			message: "Product fetch successfully!",
			data: products,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const products = await Product.findOne({ productId: id }, { _id: 0 });

		return res.json({
			status: 200,
			message: "Product fetch successfully!",
			data: products,
		});
	} catch (error) {
		return res.json({
			status: 500,
			message: error.message,
		});
	}
};

const updateProduct = async (req, res) => {
	try {
		const { productId } = req.params;
		const { name, price, type } = req.body;

		// Check if the product exists
		const productExists = await Product.findOne({ productId: productId });
		if (!productExists) {
			return res.status(400).json({
				status: 400,
				message: "Product not found!",
			});
		}

		// Prepare updated product data only for changed fields
		const updatedProductData = {
			name: name || productExists.name,
			price: price || productExists.price,
			type: type || productExists.type,
		};

		// Update the product
		const updatedProduct = await Product.findOneAndUpdate(
			{ productId: productId },
			updatedProductData,
			{ new: true },
			{ _id: 0 }
		);

		await publishProductUpdate(updatedProduct);

		// Send a successful response
		return res.status(200).json({
			status: 200,
			message: "Product updated successfully!",
			data: updatedProduct,
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
	createProduct,
	updateProduct,
	getProductById,
	getAllProduct,
};
