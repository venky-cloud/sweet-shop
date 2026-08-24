import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import VendorSpecialtyHero from "../components/VendorSpecialtyHero.jsx";
import { formatINR } from "../lib/currency.js";

const categories = [
  { name: "Pure Ghee", image: "/images/products/a2-bilona-desi-ghee.jpg" },
  { name: "Laddu", image: "/images/products/motichoor-laddu.jpg" },
  { name: "Barfi & Katli", image: "/images/products/kaju-katli.jpg" },
  { name: "Halwa", image: "/images/products/carrot-halwa.jpg" },
  { name: "Festive Specials", image: "/images/products/ghevar.jpg" },
  { name: "South Indian Classics", image: "/images/products/mysore-pak.jpg" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then((all) => {
        setFeatured(all.filter((p) => p.featured).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <VendorSpecialtyHero />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Reveal>
          <h2 className="font-heading text-2xl font-semibold text-center text-ink">Shop by category</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <Link
                to={`/products?category=${encodeURIComponent(c.name)}`}
                className="block rounded-card bg-white border border-hairline p-4 text-center hover:shadow-mithai hover:-translate-y-1 transition-all"
              >
                <div className="mx-auto w-16 aspect-square overflow-hidden rounded-card">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 font-semibold text-sm text-ink">{c.name}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-ink">Vendor's picks</h2>
          <Link to="/products" className="text-sm font-semibold text-maroon hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <p className="mt-8 text-ink-soft">Loading sweets…</p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <Reveal key={p._id} as="li" delay={i * 0.08} className="list-none">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <Reveal className="rounded-card bg-maroon text-white px-8 py-12 text-center jali-border">
          <h2 className="font-heading text-3xl font-semibold">Free shipping on orders over {formatINR(999)}</h2>
          <p className="mt-2 text-white/75">Fresh mithai, delivered to your door in 2-3 days.</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-white text-maroon px-6 py-3 text-sm font-semibold hover:bg-marigold hover:text-ink transition-colors"
          >
            Start shopping
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
