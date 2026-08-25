import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        "text-primary": "#1A1714",
        "text-secondary": "#6B6460",
        "text-muted": "#B0A89E",
        "border-default": "#E2DDD8",
        accent: "#1D4E6B",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      maxWidth: {
        content: "720px",
      },
    },
  },
  plugins: [],
};
export default config;
