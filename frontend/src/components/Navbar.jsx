import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { totals } = useCart();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    function onBump() {
      setBump(true);
      setTimeout(() => setBump(false), 750);
    }
    window.addEventListener("cart:bump", onBump);
    return () => window.removeEventListener("cart:bump", onBump);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-hairline">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-heading text-xl font-semibold text-maroon">
          <span className="text-2xl" aria-hidden="true">🪔</span>
          Mithai Ghar
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-ink-soft">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "text-maroon" : "hover:text-ink transition-colors")}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NavLink
            id="nav-cart-icon"
            to="/cart"
            className={`relative inline-flex items-center gap-2 rounded-full bg-maroon text-white px-4 py-2 text-sm font-semibold hover:bg-saffron transition-colors ${
              bump ? "animate-cart-bump" : ""
            }`}
          >
            <span aria-hidden="true">🛒</span>
            Cart
            {totals.count > 0 && (
              <span className="absolute -top-2 -right-2 grid place-items-center size-5 rounded-full bg-marigold text-ink text-xs font-bold">
                {totals.count}
              </span>
            )}
          </NavLink>
          <button
            className="md:hidden grid place-items-center size-10 rounded-full bg-white border border-hairline"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-semibold text-ink-soft">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `py-2 ${isActive ? "text-maroon" : ""}`}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
