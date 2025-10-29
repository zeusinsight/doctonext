/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: "#F5F3E7", // soft warm beige
        "care-evo": {
          primary: "#206dc5", // Care Evo primary blue
          "primary-light": "#4a8dd9", // Lighter blue for hover states
          "primary-dark": "#1a5ba3", // Darker blue for active states
          accent: "#14b8a6", // Turquoise accent from logo cross
          "accent-light": "#2dd4bf", // Lighter turquoise
          "accent-dark": "#0d9488", // Darker turquoise
        },
      },
    },
  },
  plugins: [],
};
