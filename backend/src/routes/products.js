import { Router } from "express";
import { Product } from "../models/Product.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

productsRouter.get("/:idOrSlug", async (req, res) => {
  const { idOrSlug } = req.params;
  const product = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? await Product.findById(idOrSlug)
    : await Product.findOne({ slug: idOrSlug });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});
