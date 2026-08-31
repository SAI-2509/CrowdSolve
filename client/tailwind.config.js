/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#061826",
        navy: "#0e2a47",
        teal: "#13b5a6",
        aqua: "#7be0d6",
        orange: "#ff8f3f",
        sand: "#f4efe8"
      },
      boxShadow: {
        glow: "0 22px 70px rgba(19, 181, 166, 0.18)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(123, 224, 214, 0.14) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
