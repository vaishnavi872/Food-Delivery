// backend/controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || items.length === 0 || !address.firstName || !amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "placed"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { placeOrder, getOrderById };



