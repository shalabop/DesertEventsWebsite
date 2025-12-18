import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        bg: "#0B0B0B",
        accent: "#32F36A",
        text: "#F5F5F5",
        muted: "#C4C4C4",
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(142 76% 58%)",
        background: "#0B0B0B",
        foreground: "#F5F5F5",
        card: { DEFAULT: "#111111", foreground: "#F5F5F5" },
        popover: { DEFAULT: "#111111", foreground: "#F5F5F5" },
        primary: { DEFAULT: "#32F36A", foreground: "#0B0B0B" },
        secondary: { DEFAULT: "#1A1A1A", foreground: "#F5F5F5" }
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        spinsoft: { to: { transform: "rotate(360deg)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } }
      },
      animation: {
        spinsoft: "spinsoft 1.2s linear infinite",
        fadeIn: "fadeIn 400ms ease-out"
      }
    }
  },
  plugins: []
}
export default config
