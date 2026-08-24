import { motion } from "framer-motion";
import SweetIcon from "./SweetIcon.jsx";

// Continuously-spinning 3D showcase: a perspective wrapper rotates the icon
// (or a real product photo) around the Y axis while a floating bob + pulsing
// shadow sell the depth.
export default function Sweet3DShowcase({ shape, fill, tone, image, alt = "", className = "", duration = 7 }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: "1000px" }}>
      <motion.div
        animate={{ rotateY: 360, y: [0, -10, 0] }}
        transition={{
          rotateY: { repeat: Infinity, duration, ease: "linear" },
          y: { repeat: Infinity, duration: duration / 2, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {image ? (
          <div className="aspect-square w-full overflow-hidden rounded-card shadow-mithai">
            <img src={image} alt={alt} className="h-full w-full object-cover" />
          </div>
        ) : (
          <SweetIcon shape={shape} fill={fill} tone={tone} />
        )}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="mx-auto mt-2 h-3 w-2/3 rounded-full bg-black/20 blur-md"
        animate={{ scaleX: [1, 0.7, 1], opacity: [0.25, 0.15, 0.25] }}
        transition={{ repeat: Infinity, duration: duration / 2, ease: "easeInOut" }}
      />
    </div>
  );
}
