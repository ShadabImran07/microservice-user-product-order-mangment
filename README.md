# Microservices Project

This project consists of multiple microservices, including `user-service`, `product-service`, `order-service`, and an `api-gateway` for communication through GraphQL.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (if running services locally)

## Getting Started

### 1. Clone the Repository
First, clone the repository to your local machine:

```bash
git clone {{repo_url}}
cd {{repo_folder}}
```

2. Setup MongoDB (Database)
Go to MongoDB Atlas and create a new database cluster.
After setting up your cluster, create the necessary database and collections.
Generate a MongoDB connection URL for each service.
3. Setup RabbitMQ (Message Broker)
Go to RabbitMQ and set up your message broker.
Create queues for message queuing as needed.
Generate a RabbitMQ connection URL.
4. Configure Environment Files
Each service (user-service, product-service, order-service, and api-gateway) requires a .env file for environment-specific configurations.

User Service

go the user-service folder

```bash
cd user-service
```


Create a .env file using the provided .env.sample:

```bash
cp .env.sample .env
```

Open the .env file and copy the following values:
```bash
MONGO_DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/dbname?retryWrites=true&w=majority
RABBITMQ_URL=amqp://<username>:<password>@<broker-url>
JWT_SECRET=<your_jwt_secret>
```

do same for product-serivce ,order-service and api-gateway

5. Install Docker
Ensure Docker is installed on your system. You can download Docker from here.

To check if Docker is installed, run:
```bash
docker --version
```
6. Running the Microservices
Once Docker is installed and your environment files are set up, run the following command from the root directory of the project to build and start all services:
```bash
docker-compose up --build
```
This will build the Docker images and spin up the containers for each microservice.

7. Using the Microservices
After the containers have started, you can begin interacting with the microservices through the API Gateway, which exposes a GraphQL endpoint.

By default, the API Gateway should be running on http://localhost:4000/graphql. You can use any GraphQL client or tool (such as Postman or Apollo Studio) to query the services.

Available GraphQL Queries/Mutations
User operations: Create user, Login, Fetch user info
Product operations: List products, Add products
Order operations: Create order, Fetch orders





