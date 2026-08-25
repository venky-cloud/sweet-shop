import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import ProductImage from "./ProductImage.jsx";
import SpecialtyBadge from "./SpecialtyBadge.jsx";
import TiltCard from "./TiltCard.jsx";
import AddToCartModal from "./AddToCartModal.jsx";
import { formatINR } from "../lib/currency.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);
  const cheapest = product.weightOptions[0];
  const inStock = product.stock > 0;

  return (
    <>
      <TiltCard
        maxTilt={8}
        className="group rounded-card bg-white border border-hairline overflow-hidden hover:shadow-mithai transition-shadow duration-300"
      >
        <Link to={`/products/${product.slug || product._id}`} className="block relative">
          {product.specialty && <SpecialtyBadge className="absolute top-2 left-2 z-10" />}
          <ProductImage product={product} />
          <div className="p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-marigold-dark">{product.category}</p>
            <h3 className="mt-1 font-heading font-semibold text-lg leading-tight text-ink">{product.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">⭐ {product.rating?.toFixed(1) ?? "4.5"}</p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2 px-4 pb-4">
          <span className="font-heading font-semibold text-lg text-maroon">
            From {formatINR(cheapest.price)}
          </span>
          <button
            onClick={() => setShowModal(true)}
            disabled={!inStock}
            className={`rounded-full text-sm font-semibold px-4 py-2 transition-colors ${
              inStock ? "bg-maroon text-white hover:bg-saffron" : "bg-hairline text-ink-soft cursor-not-allowed"
            }`}
          >
            {inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </TiltCard>

      {showModal && (
        <AddToCartModal
          product={product}
          onClose={() => setShowModal(false)}
          onConfirm={(option, qty) => {
            addItem(product, option, qty);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
