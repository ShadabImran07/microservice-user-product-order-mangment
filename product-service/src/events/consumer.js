// productConsumer.js
import amqp from "amqplib";

import config from "../config/config.js";

const consumeProductEvents = async () => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Create a queue for product service and bind it to listen for product.created events
		const { queue } = await channel.assertQueue("", { exclusive: true });
		console.log(`Waiting for product messages in queue: ${queue}`);

		// Bind the queue to product.* messages (e.g., product.created)
		await channel.bindQueue(queue, exchange, "product.*");
		await channel.bindQueue(queue, exchange, "order.*");

		channel.consume(
			queue,
			(msg) => {
				if (msg.content) {
					const content = msg.content.toString();
					if (msg.fields.routingKey === "order.placed") {
						console.log(`Received Order placed event: ${content}`);
					} else if (msg.fields.routingKey === "order.update") {
						console.log(`Received Order Update event: ${content}`);
						// Logic to handle Inventry in Order Service
					} else {
						console.log(`Received product created event: ${content}`);
						// Logic to handle new product in Order Service
					}
				}
			},
			{ noAck: true }
		);
	} catch (error) {
		console.error("Error in product consumer:", error);
	}
};

export default consumeProductEvents;
