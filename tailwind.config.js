/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0B",
        accent: "#32F36A",
        text: "#F5F5F5",
        muted: "#C4C4C4"
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" }
    }
  },
  plugins: []
}
