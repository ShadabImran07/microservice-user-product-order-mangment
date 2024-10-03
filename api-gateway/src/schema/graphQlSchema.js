import { buildSchema } from "graphql";

export const schema = buildSchema(`
# Define the User type with fields that will be returned in responses
    type User {
    userId: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
    }

# Define the response type that includes status, message, and optional user data
    type UserResponse {
    status: Int!
    message: String!
    data: User
    }


    # Response type for fetching users
    type AllUsersResponse {
    status: Int!
    message: String!
    data: [User]! # An array of User objects
    }

# Define the login response, which includes the JWT token
    type LoginResponse {
    status: Int!
    message: String!
    token: String
    }

    type Product {
        productId: ID!
        name: String!
        price: Int!
        type:String!
        createdAt: String
        updatedAt: String
    }

    # Response type for fetching Product
    type AllProductResponse {
    status: Int!
    message: String!
    data: [Product]! # An array of Prodcuts objects
    }

    # Response type for fetching Product
    type ProductByIDResponse {
    status: Int!
    message: String!
    data: Product!
    }

    type Order {
        orderId: ID!
        userId: ID!
        productId: ID!
        quantity: Int!
        paymentMethod: String!
        orderStatus: String!
        orderAmt: Int!
        createdAt: String
        updatedAt: String

    }

    type AllOrderResponse {
    status: Int!
    message: String!
    data: [Order]!
    }

    type OrderByIdResponse {
    status: Int!
    message: String!
    data: Order
    }

    type Query {
        users:AllUsersResponse
        user(id: ID!):UserResponse
        products: AllProductResponse
        product(id: ID!): ProductByIDResponse
        orders: AllOrderResponse
        order(id: ID!): OrderByIdResponse
    }

    type Mutation {
        registerUser(name: String!,email: String!,password: String!): UserResponse
        loginUser(email: String!,password: String!): LoginResponse
        updateProfile(email: String,password: String,name: String): UserResponse
        createProduct(name: String!, price: Int!, type: String!): ProductByIDResponse
        placeOrder(userId:String!, productId:String!, qty:Int!, price:Int!, paymentMethod:String): OrderByIdResponse
    }
`);
