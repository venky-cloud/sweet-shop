import { useState } from "react";
import { formatINR } from "../lib/currency.js";
import { isLiveProduct } from "../lib/api.js";
import QuantityStepper from "./QuantityStepper.jsx";

export default function AddToCartModal({ product, onClose, onConfirm }) {
  const canOrder = isLiveProduct(product);
  const inStock = product.stock > 0 && canOrder;
  const [selected, setSelected] = useState(product.weightOptions[0]);
  const [qty, setQty] = useState(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-card bg-white p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <img src={product.image} alt={product.name} className="size-14 rounded-xl object-cover shrink-0" />
          <div className="min-w-0">
            <p className="font-heading font-semibold text-ink truncate">{product.name}</p>
            <p className="text-sm text-ink-soft">{!canOrder ? "Currently unavailable" : inStock ? "In stock" : "Out of stock"}</p>
          </div>
        </div>

        {inStock ? (
          <>
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Weight / Pack size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.weightOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelected(opt)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      selected.label === opt.label
                        ? "border-maroon bg-maroon text-white"
                        : "border-hairline text-ink hover:border-marigold"
                    }`}
                  >
                    {opt.label} · {formatINR(opt.price)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <QuantityStepper qty={qty} onChange={setQty} max={product.stock} />
              <button
                type="button"
                onClick={() => onConfirm(selected, qty)}
                className="flex-1 rounded-full bg-maroon text-white px-4 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
              >
                Add · {formatINR(selected.price * qty)}
              </button>
            </div>
          </>
        ) : (
          <p className="mt-5 text-sm text-ink-soft">
            {!canOrder ? "This item isn't available to order right now — please refresh and try again." : "This sweet is currently out of stock."}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-ink-soft hover:text-ink py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
