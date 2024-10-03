import { Router } from "express";
import OrderController from "../controllers/OrderController.js";
// import { userVerify } from "../middleware/index.js";

const orderRouter = Router();

orderRouter.post("/create", OrderController.createOder);
orderRouter.get("/", OrderController.getAllOders);
orderRouter.post("/update/:id", OrderController.updateOrder);
orderRouter.get("/:id", OrderController.getOrderById);

export default orderRouter;
