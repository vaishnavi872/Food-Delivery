import mongoose from "mongoose";

// Define the schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Add an image field
  price: { type: Number, required: true },
  category: { type: String, required: true }
});

// Create and export the model
const Food = mongoose.model("Food", foodSchema);
export default Food;

