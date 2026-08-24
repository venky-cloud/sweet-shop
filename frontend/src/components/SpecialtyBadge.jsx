import { motion } from "framer-motion";

export default function SpecialtyBadge({ className = "" }) {
  return (
    <motion.span
      className={`inline-flex items-center gap-1 rounded-full bg-maroon text-white text-[0.6rem] font-semibold uppercase tracking-wider px-2.5 py-1 shadow-mithai ${className}`}
      animate={{ boxShadow: ["0 0 0 0 rgba(122,17,35,0.4)", "0 0 0 8px rgba(122,17,35,0)"] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
    >
      ✨ Specialty
    </motion.span>
  );
}
