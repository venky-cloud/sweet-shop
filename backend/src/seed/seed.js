import "dotenv/config";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";
import { seedProducts } from "./seedData.js";
import mongoose from "mongoose";

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(seedProducts);
  console.log(`[seed] inserted ${seedProducts.length} products`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
