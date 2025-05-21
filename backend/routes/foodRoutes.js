import express from "express";
import Food from "../models/foodModel.js";
import multer from "multer";
import fs from "fs";
import path from "path";


const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve uploaded images statically
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ **GET /api/food/list** → Fetch all food items
router.get("/list", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json({ status: "success", data: foods });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ✅ **POST /api/food/add** → Add a new food item
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ status: "error", message: "Invalid price format" });
    }
    if (!name || !description || !category) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const image = req.file ? req.file.filename : null;
    const newFood = new Food({ name, description, image, price: parsedPrice, category });
    await newFood.save();

    res.status(201).json({ status: "success", data: newFood });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ✅ **DELETE /api/food/remove/:id** → Remove food item by ID
router.delete("/remove/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    
    if (!food) {
      return res.status(404).json({ status: "error", message: "Food item not found" });
    }

    // Remove the image file if it exists
    if (food.image) {
      const imagePath = path.join(process.cwd(), "uploads", food.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete food item from DB
    await Food.findByIdAndDelete(id);
    res.json({ status: "success", message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;

