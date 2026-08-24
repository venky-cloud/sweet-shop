import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../lib/api.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductImage from "../components/ProductImage.jsx";
import Sweet3DShowcase from "../components/Sweet3DShowcase.jsx";
import SpecialtyBadge from "../components/SpecialtyBadge.jsx";
import TiltCard from "../components/TiltCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { formatINR } from "../lib/currency.js";

const categories = [
  { name: "Pure Ghee", image: "/images/products/a2-bilona-desi-ghee.jpg" },
  { name: "Laddu", image: "/images/products/motichoor-laddu.jpg" },
  { name: "Barfi & Katli", image: "/images/products/kaju-katli.jpg" },
  { name: "Halwa", image: "/images/products/carrot-halwa.jpg" },
  { name: "Festive Specials", image: "/images/products/ghevar.jpg" },
  { name: "South Indian Classics", image: "/images/products/mysore-pak.jpg" },
];

const SPECIALTY_SLUGS = ["a2-bilona-desi-ghee", "mysore-pak", "payasam"];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then((all) => {
        setFeatured(all.filter((p) => p.featured).slice(0, 4));
        setSpecialties(
          SPECIALTY_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 grid gap-10 md:grid-cols-2 items-center bg-diya-glow overflow-hidden">
        <Reveal>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-maroon">
            <span className="size-1.5 rounded-full bg-saffron" /> Hand-made daily. Pure desi ghee.
          </p>
          <h1 className="mt-4 font-heading text-4xl sm:text-6xl font-semibold leading-[1.05] text-ink">
            Traditional mithai, <span className="text-maroon">made with pure ghee.</span>
          </h1>
          <p className="mt-5 text-ink-soft text-lg max-w-md">
            From melt-in-the-mouth laddus to festive ghevar and creamy rabri, Mithai Ghar hand-crafts
            every sweet in small batches using time-honored recipes and generous ghee.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
            >
              Shop all sweets
            </Link>
            <Link
              to="/products?category=Pure%20Ghee"
              className="rounded-full border border-hairline px-6 py-3 text-sm font-semibold hover:border-maroon transition-colors"
            >
              Shop pure ghee
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.15} y={0} className="w-full max-w-xs mx-auto">
          <Sweet3DShowcase image="/images/products/a2-bilona-desi-ghee.jpg" alt="A2 Bilona Desi Ghee" />
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-marigold-dark">
            Our signature: A2 Bilona Desi Ghee
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-maroon text-center">Vendor's specialties</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-center text-ink">Made the way it should be</h2>
        </Reveal>
        {specialties.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {specialties.map((p, i) => (
              <Reveal key={p._id} delay={i * 0.12}>
                <TiltCard maxTilt={10} className="relative rounded-card bg-white border border-hairline p-6 h-full">
                  <SpecialtyBadge className="absolute top-3 left-3 z-10" />
                  <div className="w-28 mx-auto">
                    <ProductImage product={p} />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-center text-ink">{p.name}</h3>
                  <p className="mt-2 text-sm text-ink-soft text-center leading-relaxed">{p.description}</p>
                  <p className="mt-4 text-center font-heading font-semibold text-maroon">
                    From {formatINR(p.weightOptions[0].price)}
                  </p>
                  <Link
                    to={`/products/${p.slug}`}
                    className="mt-4 block text-center rounded-full bg-maroon text-white text-sm font-semibold px-4 py-2 hover:bg-saffron transition-colors"
                  >
                    View sweet
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}
      </section>

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
