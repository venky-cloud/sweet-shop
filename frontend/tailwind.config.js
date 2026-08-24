/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["\"Playfair Display\"", "Georgia", "serif"],
        body: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FFF8EC",
        maroon: {
          DEFAULT: "#7A1123",
          dark: "#560B18",
          light: "#9C2436",
        },
        marigold: {
          DEFAULT: "#E8A33D",
          light: "#F4C878",
          dark: "#C77E1F",
        },
        saffron: "#FF7A1A",
        ink: "#2B1810",
        "ink-soft": "#8A7365",
        hairline: "#F0E1C9",
      },
      borderRadius: {
        card: "1.5rem",
      },
      boxShadow: {
        mithai: "0 24px 48px -24px rgba(122, 17, 35, 0.35)",
      },
      backgroundImage: {
        "diya-glow": "radial-gradient(circle at 30% 20%, rgba(232,163,61,0.18), transparent 55%)",
      },
      keyframes: {
        "cart-bump": {
          "0%": { transform: "scale(1) rotate(0deg)", boxShadow: "0 0 0 0 rgba(255,214,102,0.7)" },
          "30%": { transform: "scale(1.4) rotate(-10deg)", boxShadow: "0 0 0 8px rgba(255,214,102,0.45)" },
          "55%": { transform: "scale(0.9) rotate(8deg)", boxShadow: "0 0 0 16px rgba(255,214,102,0.15)" },
          "80%": { transform: "scale(1.1) rotate(-3deg)", boxShadow: "0 0 0 22px rgba(255,214,102,0)" },
          "100%": { transform: "scale(1) rotate(0deg)", boxShadow: "0 0 0 0 rgba(255,214,102,0)" },
        },
      },
      animation: {
        "cart-bump": "cart-bump 0.7s cubic-bezier(0.34,1.56,0.64,1)",
      },
    },
  },
  plugins: [],
};
