import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        input: "var(--border-color)",
        ring: "var(--primary-500)",
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",
        surface: {
          DEFAULT: "var(--bg-surface)",
          elevated: "var(--bg-surface-elevated)",
          subtle: "var(--bg-surface-subtle)",
          active: "var(--bg-surface-active)",
        },
        primary: {
          DEFAULT: "var(--primary-500)",
          hover: "var(--primary-600)",
          active: "var(--primary-700)",
          subtle: "var(--primary-50)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        secondary: {
          DEFAULT: "var(--secondary-500)",
          hover: "var(--secondary-600)",
          subtle: "var(--secondary-50)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
        },
        destructive: {
          DEFAULT: "var(--destructive-600)",
          hover: "var(--destructive-700)",
          subtle: "var(--destructive-50)",
          50: "var(--destructive-50)",
          500: "var(--destructive-500)",
          600: "var(--destructive-600)",
          700: "var(--destructive-700)",
        },
        care: {
          DEFAULT: "#ff645e",
          hover: "#e84f49",
          subtle: "#fff1f0",
          50: "#fff1f0",
          100: "#ffe1df",
          200: "#ffc2bf",
          500: "#ff645e",
          600: "#e84f49",
          700: "#cf3832",
        },
        muted: {
          DEFAULT: "var(--bg-surface-subtle)",
          foreground: "var(--text-muted)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(220, 38, 38, 0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
