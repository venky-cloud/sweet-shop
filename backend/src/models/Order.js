import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weightLabel: { type: String, required: true },
    image: { type: String, required: true },
    shape: { type: String, required: true },
    fill: { type: String, required: true },
    tone: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["card", "cod"], default: "card" },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
