import { Router } from "express";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

export const ordersRouter = Router();

const GST_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 79;

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

ordersRouter.post("/", async (req, res, next) => {
  try {
    const { items, customer, paymentMethod } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must include at least one item" });
    }
    if (!customer?.name || !customer?.email || !customer?.address || !customer?.city || !customer?.zip) {
      return res.status(400).json({ message: "Missing customer details" });
    }

    const resolvedItems = [];
    for (const item of items) {
      if (!OBJECT_ID_RE.test(item.productId)) {
        return res.status(400).json({ message: `Unknown product: ${item.productId}` });
      }
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Unknown product: ${item.productId}` });
      const option = product.weightOptions.find((w) => w.label === item.weightLabel);
      if (!option) return res.status(400).json({ message: `Unknown weight option for ${product.name}: ${item.weightLabel}` });
      const qty = Math.max(1, Number(item.qty) || 1);
      resolvedItems.push({
        product: product._id,
        name: product.name,
        price: option.price,
        weightLabel: option.label,
        image: product.image,
        shape: product.shape,
        fill: product.fill,
        tone: product.tone,
        qty,
      });
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      items: resolvedItems,
      customer,
      paymentMethod: paymentMethod === "cod" ? "cod" : "card",
      subtotal,
      shipping,
      tax,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

ordersRouter.get("/:id", async (req, res, next) => {
  try {
    if (!OBJECT_ID_RE.test(req.params.id)) {
      return res.status(404).json({ message: "Order not found" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
});
