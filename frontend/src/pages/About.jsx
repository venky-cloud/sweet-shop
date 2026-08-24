import Reveal from "../components/Reveal.jsx";
import TiltCard from "../components/TiltCard.jsx";
import Sweet3DShowcase from "../components/Sweet3DShowcase.jsx";

const values = [
  { image: "/images/products/pure-cow-ghee.jpg", title: "Pure desi ghee", body: "Every laddu, halwa, and barfi is cooked in generous, pure cow-ghee — never vanaspati or palm oil." },
  { image: "/images/products/besan-laddu.jpg", title: "Small batches", body: "Made fresh in our kitchen each morning by our team of mithai artisans, never mass-produced." },
  { image: "/images/products/ghevar.jpg", title: "Festival ready", body: "From everyday laddus to Diwali ghevar and gujiya, we cover every regional tradition." },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-maroon">Our story</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-ink">Sweets made the slow way</h1>
          <p className="mt-6 text-ink-soft leading-relaxed max-w-2xl">
            Mithai Ghar started as a family kitchen selling hand-rolled laddus at the local market. Today
            we're a full mithai shop, but the recipe hasn't changed: pure ghee, honest ingredients, and
            recipes passed down through generations. Everything you see in our shop — from Bengali rasgulla
            to Rajasthani ghevar — is hand-made by our team of confectioners using traditional methods.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="w-32 mx-auto hidden md:block">
          <Sweet3DShowcase image="/images/products/a2-bilona-desi-ghee.jpg" alt="A2 Bilona Desi Ghee" duration={9} />
        </Reveal>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.1}>
            <TiltCard maxTilt={8} className="rounded-card bg-white border border-hairline p-6 h-full">
              <div className="w-14 aspect-square overflow-hidden rounded-card">
                <img src={v.image} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-3 font-heading font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{v.body}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 rounded-card bg-maroon text-white p-8 text-center jali-border">
        <h2 className="font-heading text-2xl font-semibold">Come visit our kitchen</h2>
        <p className="mt-2 text-white/75">120 Ghee Lane, Mumbai — open daily, 8am to 9pm.</p>
      </Reveal>
    </div>
  );
}
