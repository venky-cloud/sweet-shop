import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // Stub: no backend endpoint wired up for contact messages, this just
    // confirms receipt locally.
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-widest text-maroon">Get in touch</p>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-semibold text-ink">We'd love to hear from you</h1>
        <p className="mt-4 text-ink-soft">Questions about an order, a festival box, or bulk gifting? Send us a note.</p>

        <div className="mt-8 space-y-4 text-sm">
          <p><span className="font-semibold text-ink">Email:</span> <a href="mailto:hello@vijayacottage.shop" className="text-maroon hover:underline">hello@vijayacottage.shop</a></p>
          <p><span className="font-semibold text-ink">Phone:</span> <a href="tel:+912212345678" className="text-maroon hover:underline">+91 22 1234 5678</a></p>
          <p><span className="font-semibold text-ink">Address:</span> 120 Ghee Lane, Mumbai</p>
          <p><span className="font-semibold text-ink">Hours:</span> Daily, 8am – 9pm</p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="rounded-card bg-white border border-hairline p-6">
        {sent ? (
          <div className="text-center py-8">
            <div className="text-4xl">🪔</div>
            <h2 className="mt-4 font-heading text-xl font-semibold text-ink">Message sent!</h2>
            <p className="mt-2 text-sm text-ink-soft">We'll get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-hairline bg-cream px-4 py-2.5 text-sm focus:border-marigold"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-hairline bg-cream px-4 py-2.5 text-sm focus:border-marigold"
                placeholder="you@email.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Message</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-hairline bg-cream px-4 py-2.5 text-sm focus:border-marigold"
                placeholder="How can we help?"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-maroon text-white px-6 py-3 text-sm font-semibold hover:bg-saffron transition-colors"
            >
              Send message
            </button>
          </form>
        )}
      </Reveal>
    </div>
  );
}
