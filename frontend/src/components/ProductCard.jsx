import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import ProductImage from "./ProductImage.jsx";
import SpecialtyBadge from "./SpecialtyBadge.jsx";
import TiltCard from "./TiltCard.jsx";
import { formatINR } from "../lib/currency.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const cheapest = product.weightOptions[0];

  return (
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
      <div className="flex items-center justify-between px-4 pb-4">
        <span className="font-heading font-semibold text-lg text-maroon">
          From {formatINR(cheapest.price)}
        </span>
        <button
          onClick={() => addItem(product, cheapest, 1)}
          className="rounded-full bg-maroon text-white text-sm font-semibold px-4 py-2 hover:bg-saffron transition-colors"
        >
          Add to cart
        </button>
      </div>
    </TiltCard>
  );
}
