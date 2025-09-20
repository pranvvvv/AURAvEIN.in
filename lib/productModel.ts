import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: Number,
  image: String,
  images: [String],
  videoUrl: String,
  rating: Number,
  reviews: Number,
  category: String,
  description: String,
  sizes: [String],
  colors: [String],
  stock: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  isLimitedEdition: Boolean,
  quantity: Number,
  overlaySettings: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Product || model("Product", ProductSchema);
