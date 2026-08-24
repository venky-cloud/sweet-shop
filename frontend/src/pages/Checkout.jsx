import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { createOrder } from "../lib/api.js";
import { formatINR } from "../lib/currency.js";
import Reveal from "../components/Reveal.jsx";

const initialForm = { name: "", email: "", address: "", city: "", zip: "", paymentMethod: "card" };

export default function Checkout() {
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) return <Navigate to="/cart" replace />;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.productId, weightLabel: i.weightLabel, qty: i.qty })),
        customer: { name: form.name, email: form.email, address: form.address, city: form.city, zip: form.zip },
        paymentMethod: form.paymentMethod,
      };
      const { data: order, demo } = await createOrder(payload);
      clearCart();
      navigate(`/order-confirmation/${order._id}`, { state: { order, demo } });
    } catch (err) {
      setError(err.message || "Something went wrong placing your order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 grid md:grid-cols-[1.2fr_1fr] gap-10">
      <Reveal>
        <h1 className="font-heading text-3xl font-semibold text-ink">Checkout</h1>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} placeholder="Alex Rivera" required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@email.com" required />
          <Field label="Delivery address" value={form.address} onChange={(v) => update("address", v)} placeholder="123 Ghee Lane" required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Mumbai" required />
            <Field label="PIN code" value={form.zip} onChange={(v) => update("zip", v)} placeholder="400001" required />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Payment method</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                { value: "card", label: "💳 Card" },
                { value: "cod", label: "💵 Cash on delivery" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => update("paymentMethod", opt.value)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold text-left ${
                    form.paymentMethod === opt.value ? "border-maroon bg-maroon/10" : "border-hairline"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order · ${formatINR(totals.total)}`}
          </button>
        </form>
      </Reveal>

      <Reveal delay={0.1} as="aside" className="rounded-card bg-white border border-hairline p-6 h-fit">
        <h2 className="font-heading text-lg font-semibold text-ink">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between text-ink-soft">
              <span>{i.name} ({i.weightLabel}) × {i.qty}</span>
              <span>{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-hairline space-y-2 text-sm">
          <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
          <div className="flex justify-between text-ink-soft"><span>Shipping</span><span>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</span></div>
          <div className="flex justify-between text-ink-soft"><span>GST (5%)</span><span>{formatINR(totals.tax)}</span></div>
          <div className="flex justify-between font-heading text-lg font-semibold pt-2 border-t border-hairline text-ink"><span>Total</span><span>{formatINR(totals.total)}</span></div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-hairline bg-white px-4 py-2.5 text-sm focus:border-marigold"
      />
    </label>
  );
}
