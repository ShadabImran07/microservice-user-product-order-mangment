import amqp from "amqplib";

import config from "../config/config.js";

const publishMessageRegister = async (userData) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		const msg = JSON.stringify(userData);

		await channel.assertExchange(exchange, "topic", { durable: false });

		// Publishing a message with the routing key 'user.registered'
		channel.publish(exchange, "user.registered", Buffer.from(msg));
		console.log(`Message sent: ${msg}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in producer:", error);
	}
};

const publishMessageUpdate = async (userData) => {
	try {
		const connection = await amqp.connect(config.msgBrokerURL);
		const channel = await connection.createChannel();

		const exchange = "microservice_topic_exchange";
		const msg = JSON.stringify(userData);

		await channel.assertExchange(exchange, "topic", { durable: false });

		// Publishing a message with the routing key 'user.registered'
		channel.publish(exchange, "user.profile.updated", Buffer.from(msg));
		console.log(`Message sent: ${msg}`);

		setTimeout(() => {
			channel.close();
			connection.close();
		}, 500);
	} catch (error) {
		console.error("Error in producer:", error);
	}
};

export { publishMessageRegister, publishMessageUpdate };
