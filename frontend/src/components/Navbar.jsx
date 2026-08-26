import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fallbackProducts } from "../data/products.js";
import { fuzzyMatchProduct } from "../lib/fuzzySearch.js";
import { formatINR } from "../lib/currency.js";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SPRING = { type: "spring", stiffness: 300, damping: 28 };

export default function Navbar() {
  const { totals } = useCart();
  const { favoriteIds } = useFavorites();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    function onBump() {
      setBump(true);
      setTimeout(() => setBump(false), 750);
    }
    window.addEventListener("cart:bump", onBump);
    return () => window.removeEventListener("cart:bump", onBump);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const matches = searchQuery.trim()
    ? fallbackProducts.filter((p) => fuzzyMatchProduct(searchQuery, p)).slice(0, 6)
    : [];

  function submitSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  function openProduct(p) {
    navigate(`/products/${p.slug || p._id}`);
    closeSearch();
  }

  function SuggestionList({ className = "" }) {
    if (!matches.length) return null;
    return (
      <ul
        onMouseDown={(e) => e.preventDefault()}
        className={`absolute left-0 top-full mt-2 w-full rounded-2xl bg-white border border-hairline shadow-mithai overflow-hidden z-50 ${className}`}
      >
        {matches.map((p) => (
          <li key={p._id}>
            <button
              type="button"
              onClick={() => openProduct(p)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-cream transition-colors"
            >
              <img src={p.image} alt="" className="size-9 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                <p className="text-xs text-ink-soft">
                  {p.category} · {formatINR(p.weightOptions[0].price)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className={`${searchOpen ? "hidden sm:flex" : "flex"} items-center gap-2 font-heading text-xl font-semibold text-maroon`}
        >
          <span className="text-2xl" aria-hidden="true">🪔</span>
          Vijaya Cottage
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-maroon/60">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "text-maroon font-bold" : "hover:text-maroon transition-colors")}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {searchOpen && (
          <form onSubmit={submitSearch} className="relative flex-1 flex items-center gap-2 sm:hidden">
            <div className="flex-1 flex items-center gap-2 rounded-full bg-maroon/10 px-4 py-2">
              <span className="text-maroon/60" aria-hidden="true">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sweets…"
                className="flex-1 bg-transparent text-sm text-maroon placeholder:text-maroon/50 outline-none"
              />
            </div>
            <button type="button" onClick={closeSearch} className="shrink-0 text-sm font-semibold text-maroon/80">
              Cancel
            </button>
            <SuggestionList />
          </form>
        )}

        <div className={`${searchOpen ? "hidden sm:flex" : "flex"} items-center gap-3`}>
          <div className="relative hidden sm:block">
            <motion.form
              onSubmit={submitSearch}
              initial={false}
              animate={{ width: searchOpen ? 220 : 40 }}
              transition={SPRING}
              className="flex items-center h-10 rounded-full bg-maroon/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setSearchOpen((o) => !o)}
                aria-label="Search"
                className="grid place-items-center size-10 shrink-0 text-maroon"
              >
                <motion.span animate={{ rotate: searchOpen ? 90 : 0 }} aria-hidden="true">
                  {searchOpen ? "✕" : "🔍"}
                </motion.span>
              </button>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setSearchOpen(false)}
                placeholder="Search sweets…"
                className="w-full bg-transparent pr-4 text-sm text-maroon placeholder:text-maroon/50 outline-none"
              />
            </motion.form>
            {searchOpen && <SuggestionList className="w-72" />}
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="sm:hidden grid place-items-center size-10 rounded-full bg-maroon/10 hover:bg-maroon/20 text-maroon transition-colors"
          >
            <span aria-hidden="true">🔍</span>
          </button>
          <NavLink
            to="/favorites"
            onClick={() => setOpen(false)}
            aria-label="Favourites"
            className="relative grid place-items-center size-10 rounded-full bg-maroon/10 hover:bg-maroon/20 text-maroon transition-colors"
          >
            <span aria-hidden="true">🤍</span>
            {favoriteIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center size-5 rounded-full bg-marigold text-ink text-xs font-bold">
                {favoriteIds.length}
              </span>
            )}
          </NavLink>
          <NavLink
            id="nav-cart-icon"
            to="/cart"
            className={`relative grid place-items-center size-10 rounded-full bg-maroon text-white hover:brightness-110 transition-all ${bump ? "animate-cart-bump" : ""
              }`}
            aria-label="Cart"
          >
            <span aria-hidden="true">🛒</span>
            {totals.count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center size-5 rounded-full bg-marigold text-ink text-xs font-bold">
                {totals.count}
              </span>
            )}
          </NavLink>
          <button
            className="md:hidden grid place-items-center size-10 rounded-full bg-maroon/10 hover:bg-maroon/20 text-maroon transition-colors"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && !searchOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-semibold text-maroon/70">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `py-2 ${isActive ? "text-maroon font-bold" : "hover:text-maroon"}`}
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
