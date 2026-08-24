import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProduct, getProducts } from "../lib/api.js";
import { useCart } from "../context/CartContext.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductImage from "../components/ProductImage.jsx";
import SpecialtyBadge from "../components/SpecialtyBadge.jsx";
import TiltCard from "../components/TiltCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { formatINR } from "../lib/currency.js";

export default function ProductDetails() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("loading");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setStatus("loading");
    setAdded(false);
    setQty(1);
    let currentId = null;
    getProduct(idOrSlug)
      .then((data) => {
        currentId = data._id;
        setProduct(data);
        setSelectedWeight(data.weightOptions[0]);
        setStatus("ready");
        return getProducts({ category: data.category });
      })
      .then((list) => setRelated((list || []).filter((p) => p._id !== currentId).slice(0, 4)))
      .catch(() => setStatus("error"));
  }, [idOrSlug]);

  if (status === "loading") return <p className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-ink-soft">Loading…</p>;
  if (status === "error" || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-soft">We couldn't find that sweet.</p>
        <Link to="/products" className="mt-4 inline-block text-maroon font-semibold hover:underline">
          Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-soft hover:text-ink">
        ← Back
      </button>

      <div className="mt-6 grid md:grid-cols-2 gap-10">
        {/* Large image */}
        <Reveal>
          <TiltCard maxTilt={10} className="max-w-lg">
            {product.specialty && <SpecialtyBadge className="absolute top-3 left-3 z-10" />}
            <ProductImage product={product} eager />
          </TiltCard>
        </Reveal>

        <Reveal delay={0.1}>
          {/* Product name */}
          <p className="text-xs font-semibold uppercase tracking-wider text-marigold-dark">{product.category}</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl font-semibold text-ink">{product.name}</h1>
          <p className="mt-2 text-ink-soft">⭐ {product.rating?.toFixed(1) ?? "4.5"} · {product.stock} in stock</p>

          {/* Description */}
          <p className="mt-5 text-ink-soft leading-relaxed max-w-md">{product.description}</p>

          {/* Ingredients */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Ingredients</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <li key={ing} className="rounded-full bg-cream border border-hairline px-3 py-1 text-xs text-ink">
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Weight options */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Weight / Pack size</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.weightOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setSelectedWeight(opt)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedWeight?.label === opt.label
                      ? "border-maroon bg-maroon text-white"
                      : "border-hairline text-ink hover:border-marigold"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <p className="mt-6 font-heading text-3xl font-semibold text-maroon overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedWeight?.label}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                {selectedWeight ? formatINR(selectedWeight.price) : "—"}
              </motion.span>
            </AnimatePresence>
            <span className="ml-2 text-sm font-body font-normal text-ink-soft">/ {selectedWeight?.label}</span>
          </p>

          {/* Shelf life */}
          <p className="mt-2 text-sm text-ink-soft">
            <span className="font-semibold text-ink">Shelf life:</span> {product.shelfLife}
          </p>

          {/* Quantity selector + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <QuantityStepper qty={qty} onChange={setQty} max={product.stock || 20} />
            <button
              onClick={() => {
                addItem(product, selectedWeight, qty);
                setAdded(true);
              }}
              className="rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
            >
              Add to cart
            </button>
          </div>
          {added && (
            <p className="mt-3 text-sm text-emerald-600 font-semibold">
              Added to cart! <Link to="/cart" className="underline">View cart</Link>
            </p>
          )}
        </Reveal>
      </div>

      {related.length > 0 && (
        <Reveal className="mt-16">
          <h2 className="font-heading text-2xl font-semibold text-ink">You might also like</h2>
          <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p) => (
              <li key={p._id} className="list-none">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
