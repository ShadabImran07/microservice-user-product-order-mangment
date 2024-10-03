import amqp from "amqplib";
import config from "../config/config.js";

const consumeMessages = async () => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		await channel.assertExchange(exchange, "topic", { durable: false });

		// Creating a temporary queue to consume messages
		const { queue } = await channel.assertQueue("", { exclusive: true });

		console.log(`Waiting for messages in queue: ${queue}`);

		// Binding the queue to the exchange with a topic pattern (user.*)
		await channel.bindQueue(queue, exchange, "user.*");

		channel.consume(
			queue,
			(msg) => {
				if (msg.content) {
					console.log(`Received: ${msg.content.toString()}`);
				}
			},
			{ noAck: true }
		);
	} catch (error) {
		console.error("Error in consumer:", error);
	}
};

export default consumeMessages;
