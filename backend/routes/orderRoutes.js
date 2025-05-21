import express from "express";
import { placeOrder, getOrderById } from "../controller/orderController.js";

const router = express.Router();

router.post('/checkout', (req, res) => {
  const { name, table, amount } = req.body;

  console.log('📦 Fake Order Received:', { name, table, amount });

  res.status(200).json({ message: "Order received and payment simulated!" });
});
router.post("/place", placeOrder);
router.get("/:orderId", getOrderById);

export default router;







