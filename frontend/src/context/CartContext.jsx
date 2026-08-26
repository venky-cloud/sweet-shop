import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING, GST_RATE } from "../lib/currency.js";
import { playAddToCartChime } from "../lib/sound.js";

const CartContext = createContext(null);
const STORAGE_KEY = "vijaya-cottage-cart";

function lineKey(productId, weightLabel) {
  return `${productId}::${weightLabel}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, weightOption, qty = 1) {
    const key = lineKey(product._id, weightOption.label);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          productId: product._id,
          name: product.name,
          price: weightOption.price,
          weightLabel: weightOption.label,
          image: product.image,
          shape: product.shape,
          fill: product.fill,
          tone: product.tone,
          stock: product.stock,
          qty,
        },
      ];
    });
    playAddToCartChime();
    window.dispatchEvent(new CustomEvent("cart:bump"));
  }

  function updateQty(key, qty) {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = Math.round(subtotal * GST_RATE);
    const total = subtotal + shipping + tax;
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    return { subtotal, shipping, tax, total, count };
  }, [items]);

  const value = { items, addItem, updateQty, removeItem, clearCart, totals };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
