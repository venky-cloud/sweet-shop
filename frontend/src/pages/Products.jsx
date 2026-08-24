import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";

const CATEGORIES = [
  "Pure Ghee",
  "Milk Sweets",
  "Fried & Syrup",
  "Barfi & Katli",
  "Laddu",
  "Peda",
  "Halwa",
  "Creamy & Puddings",
  "Steamed & Dumplings",
  "Flaky & Layered",
  "Festive Specials",
  "South Indian Classics",
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    getProducts({ category: activeCategory || undefined })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  function selectCategory(cat) {
    if (cat === activeCategory) setSearchParams({});
    else setSearchParams({ category: cat });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-ink">All Sweets</h1>
      <p className="mt-2 text-ink-soft">Browse our full collection of hand-made Indian mithai, made with pure ghee.</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sweets…"
          className="w-full sm:w-64 rounded-full border border-hairline bg-white px-4 py-2 text-sm focus:border-marigold"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSearchParams({})}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              !activeCategory ? "bg-maroon text-white" : "bg-white border border-hairline text-ink-soft"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => selectCategory(c)}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                activeCategory === c ? "bg-maroon text-white" : "bg-white border border-hairline text-ink-soft"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-12 text-ink-soft">Loading sweets…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-ink-soft">No sweets match your search just yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <Reveal key={p._id} as="li" delay={(i % 8) * 0.05} className="list-none">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
