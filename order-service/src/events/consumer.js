// orderConsumer.js
import amqp from "amqplib";

import config from "../config/config.js";

const consumeOrderEvents = async () => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Creating a queue for the Order Service to consume events
		const { queue } = await channel.assertQueue("", { exclusive: true });
		console.log(`Waiting for events in queue: ${queue}`);

		// Bind to 'user.registered' and 'product.created' events
		await channel.bindQueue(queue, exchange, "user.registered");
		await channel.bindQueue(queue, exchange, "product.created");

		// Consume the messages from the queue
		channel.consume(
			queue,
			(msg) => {
				if (msg.content) {
					const content = msg.content.toString();
					if (msg.fields.routingKey === "user.registered") {
						console.log(`Received user registered event: ${content}`);
						// Logic to handle user registration in Order Service
					} else if (msg.fields.routingKey === "product.created") {
						console.log(`Received product created event: ${content}`);
						// Logic to handle new product in Order Service
					}
				}
			},
			{ noAck: true }
		);
	} catch (error) {
		console.error("Error in order consumer:", error);
	}
};

export default consumeOrderEvents;
