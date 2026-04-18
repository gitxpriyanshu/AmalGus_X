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
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: { 900: '#0A1628', 800: '#0D1F3C', 700: '#122550' },
        glass: { 500: '#1E88E5', 400: '#42A5F5', 300: '#90CAF9' }
      },
    },
  },
  plugins: [],
};
export default config;
