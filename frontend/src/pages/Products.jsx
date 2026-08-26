import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { fuzzyMatchProduct } from "../lib/fuzzySearch.js";

const GRID_COLUMNS = 5; // matches lg:grid-cols-5, the widest breakpoint
const EAGER_COUNT = GRID_COLUMNS * 2; // first two rows load immediately so they don't lazy-pop mid-reveal

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
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    getProducts({ category: activeCategory || undefined })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter((p) => fuzzyMatchProduct(query, p));

  function handleCategoryChange(e) {
    const value = e.target.value;
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-ink">All Sweets</h1>
      <p className="mt-2 text-ink-soft">Browse our full collection of hand-made Indian mithai, made with pure ghee.</p>

      <div className="mt-8 flex items-center gap-3">
        <label htmlFor="category-filter" className="text-sm font-semibold text-ink shrink-0 align-items-left">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={activeCategory}
          onChange={handleCategoryChange}
          className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-semibold text-ink focus:border-maroon outline-none"
        >
          <option value="">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <ul className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="list-none animate-pulse">
              <div className="aspect-square w-full rounded-card bg-ink/5" />
              <div className="mt-3 h-3 w-2/3 rounded bg-ink/5" />
              <div className="mt-2 h-4 w-1/2 rounded bg-ink/5" />
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <p className="mt-12 text-ink-soft">No sweets match your search just yet.</p>
      ) : (
        <ul className="mt-6 sm:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {filtered.map((p, i) => (
            <Reveal key={p._id} as="li" delay={(i % GRID_COLUMNS) * 0.08} className="list-none">
              <ProductCard product={p} eager={i < EAGER_COUNT} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
