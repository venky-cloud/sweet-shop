import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fallbackProducts } from "../data/products.js";
import { formatINR } from "../lib/currency.js";
import { useCart } from "../context/CartContext.jsx";

const SPECIALTIES = [
  { slug: "mysore-pak", theme: { inner: "#d68a16", mid: "#7a3f08", outer: "#1f1003", accent: "#ffd166" } },
  { slug: "kaju-katli", theme: { inner: "#c9b98f", mid: "#6f684f", outer: "#18150f", accent: "#fff1c7" } },
  { slug: "gulab-jamun", theme: { inner: "#8b2f1f", mid: "#4b130d", outer: "#180504", accent: "#ffb36b" } },
  { slug: "motichoor-laddu", theme: { inner: "#f59e0b", mid: "#9a4f05", outer: "#241003", accent: "#ffe08a" } },
].map((s) => ({ ...s, product: fallbackProducts.find((p) => p.slug === s.slug) })).filter((s) => s.product);

const AUTO_ADVANCE_MS = 3500;

function gradientCss(theme) {
  return `radial-gradient(circle at center, ${theme.inner} 0%, ${theme.mid} 48%, ${theme.outer} 100%)`;
}

export default function VendorSpecialtyHero() {
  const { addItem } = useCart();
  const [activeSlug, setActiveSlug] = useState(SPECIALTIES[0].slug);
  const [theme, setTheme] = useState(SPECIALTIES[0].theme);
  const [prevTheme, setPrevTheme] = useState(SPECIALTIES[0].theme);
  const [fadeKey, setFadeKey] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const tiltRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const activeIndexRef = useRef(0);

  useEffect(() => {
    function onMove(e) {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener("mousemove", onMove);

    let rafId;
    function animate() {
      const time = Date.now() * 0.001;
      const cm = currentMouseRef.current;
      const m = mouseRef.current;
      cm.x += (m.x - cm.x) * 0.05;
      cm.y += (m.y - cm.y) * 0.05;

      if (tiltRef.current) {
        const floatY = Math.sin(time * 1.1) * 14;
        tiltRef.current.style.transform =
          `perspective(1200px) rotateY(${cm.x * 34}deg) rotateX(${-cm.y * 18}deg) translateY(${floatY}px)`;
      }

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      goToIndex((activeIndexRef.current + 1) % SPECIALTIES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  function goToIndex(index) {
    if (index === activeIndexRef.current) return;
    const item = SPECIALTIES[index];
    setPrevTheme(SPECIALTIES[activeIndexRef.current].theme);
    setTheme(item.theme);
    setFadeKey((k) => k + 1);
    setActiveSlug(item.slug);
    activeIndexRef.current = index;
  }

  function spawnBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("div");
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.4;
      const dist = 40 + Math.random() * 50;
      dot.style.position = "fixed";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.style.width = dot.style.height = `${4 + Math.random() * 5}px`;
      dot.style.borderRadius = "50%";
      dot.style.background = i % 2 === 0 ? "#ffd166" : "#fff1c7";
      dot.style.boxShadow = "0 0 6px rgba(255,214,102,0.7)";
      dot.style.zIndex = "9999";
      dot.style.pointerEvents = "none";
      dot.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      dot.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      dot.style.animation = "vs-burst 0.7s cubic-bezier(0.2,0.8,0.2,1) forwards";
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 720);
    }
  }

  function flyToCart(imageSrc, originEl) {
    const cartEl = document.getElementById("nav-cart-icon");
    if (!originEl || !cartEl) return;
    const startRect = originEl.getBoundingClientRect();
    const endRect = cartEl.getBoundingClientRect();
    const size = 60;

    const ghost = document.createElement("img");
    ghost.src = imageSrc;
    ghost.style.position = "fixed";
    ghost.style.left = `${startRect.left + startRect.width / 2 - size / 2}px`;
    ghost.style.top = `${startRect.top - size / 2}px`;
    ghost.style.width = `${size}px`;
    ghost.style.height = `${size}px`;
    ghost.style.objectFit = "cover";
    ghost.style.borderRadius = "50%";
    ghost.style.border = "2px solid rgba(255,255,255,0.7)";
    ghost.style.boxShadow = "0 10px 30px rgba(0,0,0,0.45)";
    ghost.style.zIndex = "9999";
    ghost.style.pointerEvents = "none";
    ghost.style.transform = "translate(0,0) scale(1) rotate(0deg)";
    ghost.style.transition = "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)";
    document.body.appendChild(ghost);

    const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
    const dy = endRect.top + endRect.height / 2 - startRect.top;

    requestAnimationFrame(() => {
      ghost.style.transform = "translate(0,-34px) scale(1.2) rotate(-10deg)";
    });
    setTimeout(() => {
      ghost.style.transition =
        "transform 0.7s cubic-bezier(0.55,0.055,0.675,0.19), opacity 0.3s ease 0.45s";
      ghost.style.transform = `translate(${dx}px, ${dy - 34}px) scale(0.15) rotate(380deg)`;
      ghost.style.opacity = "0.25";
    }, 220);
    setTimeout(() => ghost.remove(), 950);
  }

  function handleAddToCart(e) {
    const product = activeProduct;
    addItem(product, product.weightOptions[0], 1);
    setJustAdded(true);
    spawnBurst(e.clientX, e.clientY);
    flyToCart(product.image, e.currentTarget);
    setTimeout(() => setJustAdded(false), 1600);
  }

  const active = SPECIALTIES.find((s) => s.slug === activeSlug) ?? SPECIALTIES[0];
  const activeProduct = active.product;

  return (
    <section
      className="relative isolate overflow-hidden rounded-b-[3rem] min-h-[88vh]"
      style={{ "--v-accent": theme.accent }}
    >
      <div className="absolute inset-0 -z-20" style={{ background: gradientCss(prevTheme) }} />
      <div
        key={fadeKey}
        className="absolute inset-0 -z-20 vs-fade-in"
        style={{ background: gradientCss(theme) }}
      />

      <div className="relative z-[5] mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-8 lg:grid-cols-[1fr_auto_1fr] items-center min-h-[88vh]">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--v-accent)" }}>
            <span className="size-1.5 rounded-full" style={{ background: "var(--v-accent)" }} /> Fresh Daily &bull; Pure Ghee
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] text-white">
            Pure<br />Traditional
          </h1>
          <p className="mt-5 text-white/75 text-lg max-w-sm">
            Freshly prepared sweets made with pure ghee, rich dry fruits, and authentic homemade taste.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full text-[#2a1400] px-6 py-3 text-sm font-bold hover:brightness-105 transition-all"
              style={{ background: "var(--v-accent)" }}
            >
              Explore Specials
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="size-12 rounded-xl bg-white/10 border border-white/20 grid place-items-center" style={{ color: "var(--v-accent)" }}>
              <span aria-hidden="true">✦</span>
            </div>
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: "var(--v-accent)" }}>Vendor Speciality</p>
              <p className="text-sm text-white/70">Fresh Daily &bull; Pure Ghee</p>
            </div>
          </div>
        </div>

        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-36 lg:mb-8 pointer-events-none">
          <div className="absolute -inset-6 rounded-full blur-2xl" style={{ background: "radial-gradient(circle, rgba(255,214,102,0.3) 0%, transparent 70%)" }} />
          <div
            className="absolute inset-0 rounded-full border-[3px]"
            style={{
              borderColor: "var(--v-accent)",
              background: "radial-gradient(circle at 50% 40%, #3a2210 0%, #1a0e05 70%, #0b0603 100%)",
              boxShadow: "0 30px 50px rgba(0,0,0,0.5)",
            }}
          />
          <div ref={tiltRef} className="absolute inset-0 grid place-items-center will-change-transform">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img src={activeProduct.image} alt={activeProduct.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute top-full left-0 right-0 mt-4 flex flex-col items-center gap-3 pointer-events-auto px-4">
            <p className="text-center font-heading text-2xl sm:text-3xl" style={{ color: "var(--v-accent)" }}>
              {activeProduct.name}
            </p>
            <div className="relative">
              <span className="vs-pulse-ring" aria-hidden="true" />
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={activeProduct.stock <= 0}
                className={`relative rounded-full px-6 py-3 text-sm font-bold text-center shadow-lg transition-all duration-200 active:scale-95 hover:scale-105 disabled:opacity-50 disabled:pointer-events-none ${
                  justAdded ? "bg-emerald-500 text-white" : "text-[#2a1400]"
                }`}
                style={!justAdded ? { background: "var(--v-accent)" } : undefined}
              >
                {justAdded
                  ? "✓ Added to Cart"
                  : activeProduct.stock <= 0
                  ? "Out of stock"
                  : `Add to Cart — ${formatINR(activeProduct.weightOptions[0].price)}`}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--v-accent)" }}>Vendor Speciality</span>
          <div className="grid grid-cols-2 gap-3 pointer-events-auto">
            {SPECIALTIES.map((s, index) => {
              const p = s.product;
              const isActive = s.slug === activeSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => goToIndex(index)}
                  className={`w-full rounded-3xl border p-3 text-center backdrop-blur-md transition-colors duration-300 ${
                    isActive ? "shadow-[0_0_0_1px_var(--v-accent),0_15px_30px_rgba(0,0,0,0.35)]" : "hover:bg-white/10"
                  }`}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: isActive ? "var(--v-accent)" : "rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">{p.name}</p>
                  <p className="text-xs font-bold" style={{ color: "var(--v-accent)" }}>
                    From {formatINR(p.weightOptions[0].price)}
                  </p>
                  <p className="text-[0.68rem] text-white/60">{p.weightOptions.map((w) => w.label).join(" / ")}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .vs-fade-in { opacity: 0; animation: vs-fade-in 1.2s ease forwards; }
        @keyframes vs-fade-in { to { opacity: 1; } }
        .vs-pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          pointer-events: none;
          animation: vs-pulse-ring 2.2s ease-out infinite;
        }
        @keyframes vs-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255,214,102,0.55); }
          70% { box-shadow: 0 0 0 14px rgba(255,214,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,214,102,0); }
        }
        @keyframes vs-burst {
          to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
