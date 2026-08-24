import mongoose from "mongoose";

const weightOptionSchema = new mongoose.Schema(
  { label: { type: String, required: true }, price: { type: Number, required: true, min: 0 } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: { type: [String], required: true },
    weightOptions: { type: [weightOptionSchema], required: true, validate: (v) => v.length > 0 },
    shelfLife: { type: String, required: true },
    shape: { type: String, required: true },
    fill: { type: String, required: true },
    tone: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 4.5 },
    featured: { type: Boolean, default: false },
    specialty: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
