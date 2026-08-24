import { useState } from "react";
import SweetIcon from "./SweetIcon.jsx";

// Renders the real product photo when available, falling back to the
// illustrated SweetIcon if there's no image or it fails to load.
export default function ProductImage({ product, className = "", eager = false }) {
  const [errored, setErrored] = useState(false);

  if (!product.image || errored) {
    return <SweetIcon shape={product.shape} fill={product.fill} tone={product.tone} className={className} />;
  }

  return (
    <div className={`aspect-square w-full overflow-hidden rounded-card ${className}`}>
      <img
        src={product.image}
        alt={product.name}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}
