import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import dotenv from "dotenv";

import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import qrRouter from "./routes/qrRoutes.js";

// App config
dotenv.config();
const app = express();
const port = 4000;

// Middleware
app.use(express.json());

// ✅ Fixed CORS Configuration
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect("mongodb+srv://foodweb:1234567890@cluster0.apyut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/food", foodRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRouter);
app.use("/api/qr", qrRouter);

// Sample route
const foodItems = [
  { id: 1, name: 'Pizza', price: 9.99 },
  { id: 2, name: 'Burger', price: 5.99 }
];

app.get("/", (req, res) => {
  res.send("API Working ✅");
});

app.get('/api/food', (req, res) => {
  res.json(foodItems);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
2