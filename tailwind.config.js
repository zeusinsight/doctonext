/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
            },
            colors: {
                offwhite: "#F5F3E7", // soft warm beige
                "care-evo": {
                    primary: "#1e40af", // Care Evo primary blue
                    "primary-light": "#3b82f6", // Lighter blue for hover states
                    "primary-dark": "#1e3a8a", // Darker blue for active states
                    accent: "#14b8a6", // Turquoise accent from logo cross
                    "accent-light": "#2dd4bf", // Lighter turquoise
                    "accent-dark": "#0d9488" // Darker turquoise
                }
            }
        }
    },
    plugins: []
}
