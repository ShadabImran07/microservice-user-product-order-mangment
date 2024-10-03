// orderConsumer.js
import amqp from "amqplib";

import config from "../config/config.js";

const publishOrderPlaced = async (order) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Creating a message with order details
		const orderMessage = JSON.stringify(order);

		// Publish the message with the routing key 'order.placed'
		channel.publish(exchange, "order.placed", Buffer.from(orderMessage));
		console.log(`Order placed event sent: ${orderMessage}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in order producer:", error);
	}
};

const publishOrderupdate = async (order) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Creating a message with order details
		const orderMessage = JSON.stringify(order);

		// Publish the message with the routing key 'order.placed'
		channel.publish(exchange, "order.update", Buffer.from(orderMessage));
		console.log(`Order placed event sent: ${orderMessage}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in order producer:", error);
	}
};

export { publishOrderPlaced, publishOrderupdate };
