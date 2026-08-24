export default function QuantityStepper({ qty, onChange, min = 1, max = 20 }) {
  return (
    <div className="inline-flex items-center rounded-full border border-hairline bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, qty - 1))}
        className="size-9 grid place-items-center text-lg text-ink-soft hover:text-ink"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-8 text-center font-semibold">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, qty + 1))}
        className="size-9 grid place-items-center text-lg text-ink-soft hover:text-ink"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
