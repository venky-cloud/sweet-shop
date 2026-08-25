import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { getProducts } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const favorites = products.filter((p) => favoriteIds.includes(p._id));

  if (!loading && favorites.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
        <div className="text-6xl">🤍</div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink">No favourites yet</h1>
        <p className="mt-2 text-ink-soft">Tap the heart on any sweet to save it here.</p>
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Your Favourites</h1>
      <p className="mt-2 text-ink-soft">Sweets you've saved for later.</p>

      {loading ? (
        <p className="mt-12 text-ink-soft">Loading…</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {favorites.map((p, i) => (
            <Reveal key={p._id} as="li" delay={(i % 8) * 0.05} className="list-none">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
