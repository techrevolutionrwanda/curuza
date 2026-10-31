import { Router } from "express";
import { createSale, listSales, recordPayment } from "../controllers/sales.controller.js";

const router = Router();

router.get("/", listSales);
router.post("/", createSale);
router.post("/:id/payments", recordPayment);

export default router;