/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.25), 0 0 30px rgba(34,211,238,0.12)",
      },
    },
  },
  plugins: [],
};
