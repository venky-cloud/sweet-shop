import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-maroon text-white mt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-heading text-lg font-semibold">
            <span aria-hidden="true">🪔</span> Vijaya Cottage
          </div>
          <p className="mt-3 text-sm text-white/70 max-w-xs">
            Traditional Indian sweets, hand-made in small batches with pure desi ghee — from
            everyday laddus to festive specials.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li><Link to="/products" className="hover:text-white">All Sweets</Link></li>
            <li><Link to="/products?category=Pure%20Ghee" className="hover:text-white">Pure Ghee</Link></li>
            <li><Link to="/products?category=Laddu" className="hover:text-white">Laddus</Link></li>
            <li><Link to="/products?category=Barfi%20%26%20Katli" className="hover:text-white">Barfi & Katli</Link></li>
            <li><Link to="/products?category=Festive%20Specials" className="hover:text-white">Festive Specials</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">Visit</h3>
          <address className="mt-3 not-italic text-sm text-white/85 space-y-1">
            <p>120 Ghee Lane, Mumbai</p>
            <p><a href="mailto:hello@vijayacottage.shop" className="hover:text-white">hello@vijayacottage.shop</a></p>
            <p><a href="tel:+912212345678" className="hover:text-white">+91 22 1234 5678</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/60">
        © 2026 Vijaya Cottage. All rights reserved.
      </div>
    </footer>
  );
}
