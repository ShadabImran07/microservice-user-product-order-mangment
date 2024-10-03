// productConsumer.js
import amqp from "amqplib";

import config from "../config/config.js";

const publishProductCreated = async (product) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Create the product message as a stringified JSON object
		const productMessage = JSON.stringify(product);

		// Publish the product created event with the routing key 'product.created'
		channel.publish(exchange, "product.created", Buffer.from(productMessage));
		console.log(`Product created event sent: ${productMessage}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in product producer:", error);
	}
};

const publishProductUpdate = async (product) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Create the product message as a stringified JSON object
		const productMessage = JSON.stringify(product);

		// Publish the product created event with the routing key 'product.created'
		channel.publish(exchange, "product.updated", Buffer.from(productMessage));
		console.log(`Product created event sent: ${productMessage}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in product producer:", error);
	}
};

export { publishProductCreated, publishProductUpdate };
