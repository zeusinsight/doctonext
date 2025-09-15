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
            colors: {
                offwhite: "#F5F3E7" // soft warm beige
            }
        }
    },
    plugins: []
}
