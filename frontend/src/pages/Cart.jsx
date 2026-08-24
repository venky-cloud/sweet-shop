import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { formatINR } from "../lib/currency.js";

export default function Cart() {
  const { items, updateQty, removeItem, totals } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Looks like you haven't added any sweets yet.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
        >
          Browse sweets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Your Cart</h1>

      <ul className="mt-8 divide-y divide-hairline">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.key}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className="py-5 flex items-center gap-4"
            >
              <div className="size-16 shrink-0">
                <ProductImage product={item} className="rounded-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-ink">{item.name}</p>
                <p className="text-sm text-ink-soft">{item.weightLabel} · {formatINR(item.price)} each</p>
              </div>
              <QuantityStepper qty={item.qty} onChange={(q) => updateQty(item.key, q)} />
              <p className="w-20 text-right font-semibold text-ink">{formatINR(item.price * item.qty)}</p>
              <button
                onClick={() => removeItem(item.key)}
                className="text-ink-soft hover:text-maroon"
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-8 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal</span>
          <span>{formatINR(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>Shipping</span>
          <span>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>GST (5%)</span>
          <span>{formatINR(totals.tax)}</span>
        </div>
        <div className="flex justify-between font-heading text-lg font-semibold pt-2 border-t border-hairline text-ink">
          <span>Total</span>
          <span>{formatINR(totals.total)}</span>
        </div>
        <Link
          to="/checkout"
          className="mt-4 block text-center rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
