import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getOrder } from "../lib/api.js";
import { formatINR } from "../lib/currency.js";
import Reveal from "../components/Reveal.jsx";
import ProductImage from "../components/ProductImage.jsx";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [demo, setDemo] = useState(location.state?.demo || false);
  const [status, setStatus] = useState(order ? "ready" : "loading");

  useEffect(() => {
    if (order) return;
    getOrder(id)
      .then((data) => {
        setOrder(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id, order]);

  if (status === "loading") return <p className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-ink-soft">Loading your order…</p>;
  if (status === "error" || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-soft">We couldn't find that order.</p>
        <Link to="/" className="mt-4 inline-block text-maroon font-semibold hover:underline">Back home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto size-16 rounded-full bg-emerald-500 grid place-items-center text-3xl text-white"
      >
        ✓
      </motion.div>
      <Reveal delay={0.1}>
        <h1 className="mt-6 font-heading text-3xl font-semibold text-ink">Order confirmed!</h1>
        <p className="mt-2 text-ink-soft">
          Thanks{order.customer?.name ? `, ${order.customer.name.split(" ")[0]}` : ""} — your sweets are on the way.
        </p>
        <p className="mt-1 text-sm text-ink-soft">Order #{String(order._id).slice(-8).toUpperCase()}</p>
      </Reveal>

      {demo && (
        <p className="mt-4 text-xs bg-marigold/20 text-marigold-dark rounded-full px-4 py-2 inline-block">
          Demo mode: no backend/database connected, so this order was generated locally and not saved.
        </p>
      )}

      <Reveal delay={0.2} className="mt-8 rounded-card bg-white border border-hairline p-6 text-left">
        <ul className="space-y-3 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex items-center gap-3 text-ink-soft">
              <div className="size-10 shrink-0">
                <ProductImage product={i} className="rounded-lg" />
              </div>
              <span className="flex-1">{i.name} ({i.weightLabel}) × {i.qty}</span>
              <span>{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-hairline space-y-2 text-sm">
          <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          <div className="flex justify-between text-ink-soft"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span></div>
          <div className="flex justify-between text-ink-soft"><span>GST (5%)</span><span>{formatINR(order.tax)}</span></div>
          <div className="flex justify-between font-heading text-lg font-semibold pt-2 border-t border-hairline text-ink"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </Reveal>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}
