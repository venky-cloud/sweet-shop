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
    },
  },
  plugins: [],
};
