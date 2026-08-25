import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import ProductImage from "./ProductImage.jsx";
import SpecialtyBadge from "./SpecialtyBadge.jsx";
import TiltCard from "./TiltCard.jsx";
import AddToCartModal from "./AddToCartModal.jsx";
import { formatINR } from "../lib/currency.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showModal, setShowModal] = useState(false);
  const cheapest = product.weightOptions[0];
  const inStock = product.stock > 0;
  const favorite = isFavorite(product._id);

  return (
    <>
      <TiltCard
        maxTilt={8}
        className="group rounded-card bg-white border border-hairline overflow-hidden hover:shadow-mithai transition-shadow duration-300"
      >
        <button
          type="button"
          onClick={() => toggleFavorite(product._id)}
          aria-label={favorite ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={favorite}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20 grid place-items-center size-7 sm:size-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors"
        >
          <span className={`text-base sm:text-lg leading-none ${favorite ? "text-maroon" : "text-white"}`} aria-hidden="true">
            {favorite ? "♥" : "♡"}
          </span>
        </button>
        <Link to={`/products/${product.slug || product._id}`} className="block relative">
          {product.specialty && <SpecialtyBadge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10" />}
          <ProductImage product={product} />
          <div className="p-2.5 sm:p-4">
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider text-marigold-dark truncate">{product.category}</p>
            <h3 className="mt-1 font-heading font-semibold text-sm sm:text-lg leading-tight text-ink line-clamp-2">{product.name}</h3>
            <p className="mt-1 text-xs sm:text-sm text-ink-soft">⭐ {product.rating?.toFixed(1) ?? "4.5"}</p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2 px-2.5 sm:px-4 pb-2.5 sm:pb-4">
          <span className={`font-heading font-semibold text-xs sm:text-lg truncate ${inStock ? "text-maroon" : "text-ink-soft font-body font-normal"}`}>
            {inStock ? formatINR(cheapest.price) : "Out of stock"}
          </span>
          <button
            onClick={() => setShowModal(true)}
            disabled={!inStock}
            aria-label={inStock ? "Add to cart" : "Out of stock"}
            className={`shrink-0 rounded-full text-[0.65rem] sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 transition-colors ${
              inStock ? "bg-maroon text-white hover:bg-saffron" : "bg-hairline text-ink-soft cursor-not-allowed"
            }`}
          >
            Add
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
