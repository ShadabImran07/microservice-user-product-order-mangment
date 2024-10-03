import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
// import { userVerify } from "../middleware/index.js";

const productRouter = Router();

productRouter.post("/create", ProductController.createProduct);
productRouter.get("/getAllProduct", ProductController.getAllProduct);
productRouter.post("/update/:productId", ProductController.updateProduct);
productRouter.get(
	"/getProductById/:productId",
	ProductController.getProductById
);

productRouter.get("/", ProductController.getAllProduct);
productRouter.get("/:id", ProductController.getProductById);

export default productRouter;
