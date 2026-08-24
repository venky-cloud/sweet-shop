// Hand-drawn stand-ins for the decorative garnish icons that float around the
// Vendor Speciality hero (no external image assets are used anywhere in the app).
function Almond() {
  return (
    <g>
      <path d="M32 4C42 12 48 26 44 42C41 54 23 54 20 42C16 26 22 12 32 4Z" fill="#d9a86c" stroke="#8a5a26" strokeWidth="1" />
      <path d="M25 14C22 22 21 30 23 38" stroke="#f2cf9c" strokeWidth="4" strokeLinecap="round" opacity="0.6" fill="none" />
    </g>
  );
}
function Cashew() {
  return (
    <path
      d="M20 44C10 40 8 24 20 14C28 7 42 10 46 20C50 30 42 30 38 26C34 22 28 24 28 32C28 40 34 44 42 42C46 41 46 48 40 50C32 53 26 50 20 44Z"
      fill="#e8dcb5"
      stroke="#a9873f"
      strokeWidth="1"
    />
  );
}
function Pistachio() {
  return (
    <g>
      <path d="M32 4C42 4 48 16 48 30C48 46 41 58 32 58C23 58 16 46 16 30C16 16 22 4 32 4Z" fill="#e9dfc4" stroke="#8a7a4a" strokeWidth="1" />
      <path d="M32 8C38 10 42 20 42 30C42 42 37 52 32 54Z" fill="#8bae5a" />
    </g>
  );
}
function Saffron() {
  return (
    <g fill="none" strokeLinecap="round">
      <path d="M12 52C18 40 24 26 34 10" stroke="#c62b12" strokeWidth="3" />
      <path d="M20 54C26 42 32 28 40 8" stroke="#e2431e" strokeWidth="3" />
      <path d="M30 56C35 44 40 30 46 12" stroke="#ff7a3d" strokeWidth="3" />
    </g>
  );
}
function Cardamom() {
  return (
    <g>
      <path d="M32 6C44 6 50 20 50 32C50 46 42 58 32 58C22 58 14 46 14 32C14 20 20 6 32 6Z" fill="#4f7942" stroke="#294a18" strokeWidth="1" />
      <path d="M32 10V54" stroke="#294a18" strokeWidth="1" opacity="0.5" />
      <path d="M22 20C28 24 36 24 42 20" stroke="#294a18" strokeWidth="1" opacity="0.4" fill="none" />
    </g>
  );
}
function GheeDrop() {
  return (
    <g>
      <path d="M32 6C42 24 48 34 48 42C48 52 41 58 32 58C23 58 16 52 16 42C16 34 22 24 32 6Z" fill="#ffd54a" />
      <ellipse cx="26" cy="30" rx="4" ry="6" fill="#fffbe8" opacity="0.7" />
    </g>
  );
}
function RosePetal() {
  return (
    <path
      d="M32 6C46 10 50 26 40 34C50 38 46 54 32 58C18 54 14 38 24 34C14 26 18 10 32 6Z"
      fill="#f7b8c4"
      stroke="#c05a76"
      strokeWidth="1"
    />
  );
}

const SHAPES = {
  almond: Almond,
  cashew: Cashew,
  pistachio: Pistachio,
  saffron: Saffron,
  cardamom: Cardamom,
  ghee: GheeDrop,
  rose: RosePetal,
};

export default function IngredientIcon({ type, className = "" }) {
  const Shape = SHAPES[type] || Almond;
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <Shape />
    </svg>
  );
}
