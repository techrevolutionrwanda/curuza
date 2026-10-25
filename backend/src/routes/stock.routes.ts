import { Router } from "express";
import {
  createCategory,
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  restockProduct,
  updateProduct,
} from "../controllers/stock.controller.js";

const router = Router();

router.get("/products", listProducts);
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.post("/products/:id/restock", restockProduct);

router.get("/categories", listCategories);
router.post("/categories", createCategory);

export default router;
