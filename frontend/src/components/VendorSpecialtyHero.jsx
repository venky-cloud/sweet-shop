import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { fallbackProducts } from "../data/products.js";
import { formatINR } from "../lib/currency.js";
import { useCart } from "../context/CartContext.jsx";
import IngredientIcon from "./IngredientIcon.jsx";

const SPECIALTIES = [
  { slug: "mysore-pak", theme: { inner: "#d68a16", mid: "#7a3f08", outer: "#1f1003", accent: "#ffd166" } },
  { slug: "kaju-katli", theme: { inner: "#c9b98f", mid: "#6f684f", outer: "#18150f", accent: "#fff1c7" } },
  { slug: "gulab-jamun", theme: { inner: "#8b2f1f", mid: "#4b130d", outer: "#180504", accent: "#ffb36b" } },
  { slug: "motichoor-laddu", theme: { inner: "#f59e0b", mid: "#9a4f05", outer: "#241003", accent: "#ffe08a" } },
].map((s) => ({ ...s, product: fallbackProducts.find((p) => p.slug === s.slug) })).filter((s) => s.product);

const INGREDIENTS = [
  { type: "almond", top: 20, left: 12, size: 76, layer: "fg" },
  { type: "cardamom", top: 58, left: 20, size: 58, layer: "fg" },
  { type: "pistachio", top: 24, left: 78, size: 84, layer: "fg" },
  { type: "saffron", top: 8, left: 46, size: 48, layer: "fg" },
  { type: "rose", top: 70, left: 82, size: 62, layer: "fg" },
  { type: "cashew", top: 44, left: 4, size: 66, layer: "fg" },
  { type: "ghee", top: 80, left: 52, size: 58, layer: "fg" },
  { type: "almond", top: 34, left: 92, size: 42, layer: "fg", opacity: 0.7 },
  { type: "cashew", top: 14, left: 60, size: 40, layer: "bg", opacity: 0.4 },
  { type: "pistachio", top: 54, left: 68, size: 38, layer: "bg", opacity: 0.35 },
  { type: "rose", top: 84, left: 24, size: 42, layer: "bg", opacity: 0.4 },
  { type: "ghee", top: 18, left: 30, size: 34, layer: "bg", opacity: 0.3 },
];

const FLOAT_DURATIONS = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];

function gradientCss(theme) {
  return `radial-gradient(circle at center, ${theme.inner} 0%, ${theme.mid} 48%, ${theme.outer} 100%)`;
}

export default function VendorSpecialtyHero() {
  const { addItem } = useCart();
  const [activeSlug, setActiveSlug] = useState(SPECIALTIES[0].slug);
  const [theme, setTheme] = useState(SPECIALTIES[0].theme);
  const [prevTheme, setPrevTheme] = useState(SPECIALTIES[0].theme);
  const [fadeKey, setFadeKey] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [blurPx, setBlurPx] = useState(0);
  const [spinEase, setSpinEase] = useState("cubic-bezier(0.55,0.055,0.675,0.19)");
  const [spinDuration, setSpinDuration] = useState(0.6);
  const [switching, setSwitching] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const heroRef = useRef(null);
  const productCenterRef = useRef(null);
  const tiltRef = useRef(null);
  const fgLayerRef = useRef(null);
  const bgLayerRef = useRef(null);
  const particlesRef = useRef(null);
  const ingredientEls = useRef([]);
  const physics = useRef(
    INGREDIENTS.map(() => ({ mode: "float", rx: 0, ry: 0, angle: Math.random() * 360, baseX: 0, baseY: 0 }))
  );
  const switchingRef = useRef(false);
  const timeoutsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e) {
      mouseRef.current.x = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
      mouseRef.current.px = e.clientX;
      mouseRef.current.py = e.clientY;
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
      if (fgLayerRef.current) fgLayerRef.current.style.transform = `translate(${cm.x * 50}px, ${cm.y * 50}px)`;
      if (bgLayerRef.current) bgLayerRef.current.style.transform = `translate(${cm.x * -26}px, ${cm.y * -26}px)`;

      if (!switchingRef.current) {
        ingredientEls.current.forEach((el, i) => {
          if (!el) return;
          const state = physics.current[i];
          if (state.mode !== "float") return;

          const rect = el.getBoundingClientRect();
          const ex = rect.left + rect.width / 2;
          const ey = rect.top + rect.height / 2;
          const dx = m.px - ex;
          const dy = m.py - ey;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          let targetRx = 0, targetRy = 0, speedMult = 1;
          if (dist < 380) {
            const force = (380 - dist) / 380;
            targetRx = (dx / dist) * force * -70;
            targetRy = (dy / dist) * force * -70;
            speedMult = 1 + force * 5;
          }

          state.rx += (targetRx - state.rx) * 0.1;
          state.ry += (targetRy - state.ry) * 0.1;
          state.angle += 0.18 * speedMult;

          const dur = FLOAT_DURATIONS[i % FLOAT_DURATIONS.length];
          const phase = (time + i * 0.7) * ((Math.PI * 2) / dur);
          const fy = Math.sin(phase) * 13;
          const fa = Math.cos(phase) * 6;

          el.style.transform =
            `translate(calc(${state.rx + state.baseX}px), calc(${state.ry + state.baseY}px + ${fy}px)) rotate(calc(${state.angle}deg + ${fa}deg))`;
        });
      }

      rafId = requestAnimationFrame(animate);
    }
    rafId = requestAnimationFrame(animate);

    const particleId = setInterval(() => {
      const container = particlesRef.current;
      if (!container) return;
      const dot = document.createElement("div");
      const size = Math.random() * 7 + 4;
      dot.style.position = "absolute";
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.bottom = "-16px";
      dot.style.borderRadius = "50%";
      dot.style.pointerEvents = "none";
      dot.style.background = "radial-gradient(circle at 35% 30%, #fff8dd 0%, #ffd166 45%, rgba(255,209,102,0) 100%)";
      dot.style.boxShadow = "0 0 8px rgba(255,214,120,0.6)";
      const duration = Math.random() * 5 + 5;
      dot.style.animation = `vs-float-up ${duration}s linear forwards`;
      container.appendChild(dot);
      setTimeout(() => dot.remove(), duration * 1000);
    }, 380);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      clearInterval(particleId);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  function selectSpecialty(item) {
    if (switchingRef.current || item.slug === activeSlug) return;
    switchingRef.current = true;
    setSwitching(true);

    setPrevTheme(theme);
    setTheme(item.theme);
    setFadeKey((k) => k + 1);

    setSpinEase("cubic-bezier(0.55,0.055,0.675,0.19)");
    setSpinDuration(0.6);
    setBlurPx(14);
    setRotation((r) => r + 360);

    const centerRect = productCenterRef.current?.getBoundingClientRect();

    physics.current.forEach((state, i) => {
      const el = ingredientEls.current[i];
      if (!el || !centerRect) return;
      const rect = el.getBoundingClientRect();
      const dx = centerRect.left + centerRect.width / 2 - (rect.left + rect.width / 2);
      const dy = centerRect.top + centerRect.height / 2 - (rect.top + rect.height / 2);
      state.mode = "imploding";
      el.style.transition = "transform 0.5s cubic-bezier(0.55,0.055,0.675,0.19), opacity 0.5s, scale 0.5s";
      el.style.transform = `translate(${state.baseX + dx}px, ${state.baseY + dy}px) scale(0.1)`;
      el.style.opacity = "0";
    });

    const t1 = setTimeout(() => {
      setActiveSlug(item.slug);
      setSpinEase("cubic-bezier(0.34,1.56,0.64,1)");
      setSpinDuration(1.4);
      setBlurPx(0);
      setRotation((r) => r + 360);
    }, 600);

    const t2 = setTimeout(() => {
      physics.current.forEach((state, i) => {
        const el = ingredientEls.current[i];
        if (!el) return;
        const nextX = (Math.random() - 0.5) * 220;
        const nextY = (Math.random() - 0.5) * 220;
        state.mode = "exploding";
        el.style.transition = "transform 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s";
        el.style.transform = `translate(${nextX}px, ${nextY}px) scale(1)`;
        el.style.opacity = "";
        state.baseX = nextX;
        state.baseY = nextY;
      });
    }, 900);

    const t3 = setTimeout(() => {
      physics.current.forEach((state, i) => {
        state.mode = "float";
        state.rx = 0;
        state.ry = 0;
        const el = ingredientEls.current[i];
        if (el) el.style.transition = "";
      });
      switchingRef.current = false;
      setSwitching(false);
    }, 1900);

    timeoutsRef.current.push(t1, t2, t3);
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
      ref={heroRef}
      className="relative isolate overflow-hidden rounded-b-[3rem] min-h-[88vh]"
      style={{ "--v-accent": theme.accent }}
    >
      <div className="absolute inset-0 -z-20" style={{ background: gradientCss(prevTheme) }} />
      <div
        key={fadeKey}
        className="absolute inset-0 -z-20 vs-fade-in"
        style={{ background: gradientCss(theme) }}
      />
      <div ref={particlesRef} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" />

      <div ref={bgLayerRef} className="absolute inset-0 -z-10 pointer-events-none transition-transform">
        {INGREDIENTS.filter((i) => i.layer === "bg").map((ing, i) => {
          const globalIndex = INGREDIENTS.indexOf(ing);
          return (
            <div
              key={`bg-${i}`}
              ref={(el) => (ingredientEls.current[globalIndex] = el)}
              className="absolute drop-shadow-lg"
              style={{ top: `${ing.top}%`, left: `${ing.left}%`, width: ing.size, height: ing.size, opacity: ing.opacity ?? 1 }}
            >
              <IngredientIcon type={ing.type} className="w-full h-full" />
            </div>
          );
        })}
      </div>

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

        <div ref={productCenterRef} className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-36 lg:mb-8 pointer-events-none">
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
            <div
              className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: blurPx ? `blur(${blurPx}px)` : "none",
                transition: `transform ${spinDuration}s ${spinEase}, filter ${spinDuration}s ${spinEase}`,
              }}
            >
              <img src={activeProduct.image} alt={activeProduct.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute top-full left-0 right-0 mt-4 flex flex-col items-center gap-3 pointer-events-auto">
            <p className="text-center font-heading text-3xl whitespace-nowrap" style={{ color: "var(--v-accent)" }}>
              {activeProduct.name}
            </p>
            <div className="relative">
              <span className="vs-pulse-ring" aria-hidden="true" />
              <button
                type="button"
                onClick={handleAddToCart}
                className={`relative rounded-full px-6 py-3 text-sm font-bold whitespace-nowrap shadow-lg transition-all duration-200 active:scale-95 hover:scale-105 ${
                  justAdded ? "bg-emerald-500 text-white" : "text-[#2a1400]"
                }`}
                style={!justAdded ? { background: "var(--v-accent)" } : undefined}
              >
                {justAdded ? "✓ Added to Cart" : `Add to Cart — ${formatINR(activeProduct.weightOptions[0].price)}`}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--v-accent)" }}>Vendor Speciality</span>
          <div className="grid grid-cols-2 gap-3 pointer-events-auto">
            {SPECIALTIES.map((s) => {
              const p = s.product;
              const isActive = s.slug === activeSlug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  disabled={switching}
                  onClick={() => selectSpecialty(s)}
                  className={`w-36 rounded-3xl border p-3 text-center backdrop-blur-md transition-all duration-300 ${
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

      <div ref={fgLayerRef} className="absolute inset-0 z-[3] pointer-events-none transition-transform">
        {INGREDIENTS.filter((i) => i.layer === "fg").map((ing, i) => {
          const globalIndex = INGREDIENTS.indexOf(ing);
          return (
            <div
              key={`fg-${i}`}
              ref={(el) => (ingredientEls.current[globalIndex] = el)}
              className="absolute drop-shadow-lg"
              style={{ top: `${ing.top}%`, left: `${ing.left}%`, width: ing.size, height: ing.size, opacity: ing.opacity ?? 1 }}
            >
              <IngredientIcon type={ing.type} className="w-full h-full" />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes vs-float-up {
          0% { transform: translateY(0); opacity: 0; }
          12% { opacity: 0.85; }
          85% { opacity: 0.5; }
          100% { transform: translateY(-70vh); opacity: 0; }
        }
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
