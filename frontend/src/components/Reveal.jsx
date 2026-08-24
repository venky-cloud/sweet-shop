import { motion } from "framer-motion";

// Scroll-triggered fade + rise, plays once when it enters the viewport.
export default function Reveal({ children, delay = 0, y = 28, className = "", as = "div" }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
