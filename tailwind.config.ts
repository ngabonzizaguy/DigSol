import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#f5f5f5",
          soft: "#fafafa",
          deep: "#0c0a09",
        },
        ink: "#0c0a09",
        body: "#4e4e4e",
        "body-strong": "#292524",
        muted: {
          DEFAULT: "#777169",
          soft: "#a8a29e",
        },
        hairline: {
          DEFAULT: "#e7e5e4",
          soft: "#f0efed",
          strong: "#d6d3d1",
        },
        surface: {
          card: "#ffffff",
          strong: "#f0efed",
          dark: "#0c0a09",
          "dark-elevated": "#1c1917",
        },
        primary: {
          DEFAULT: "#292524",
          active: "#0c0a09",
          foreground: "#ffffff",
        },
        "on-dark": {
          DEFAULT: "#ffffff",
          soft: "#a8a29e",
        },
        orb: {
          mint: "#a7e5d3",
          peach: "#f4c5a8",
          lavender: "#c8b8e0",
          sky: "#a8c8e8",
          rose: "#e8b8c4",
        },
        success: "#16a34a",
        error: "#dc2626",
        warning: "#d97706",
        info: "#2563eb",
        // Admin tokens (semantic, dark-mode aware via CSS variables)
        admin: {
          bg: "rgb(var(--admin-bg) / <alpha-value>)",
          surface: "rgb(var(--admin-surface) / <alpha-value>)",
          elevated: "rgb(var(--admin-elevated) / <alpha-value>)",
          border: "rgb(var(--admin-border) / <alpha-value>)",
          "border-soft": "rgb(var(--admin-border-soft) / <alpha-value>)",
          fg: "rgb(var(--admin-fg) / <alpha-value>)",
          "fg-muted": "rgb(var(--admin-fg-muted) / <alpha-value>)",
          "fg-subtle": "rgb(var(--admin-fg-subtle) / <alpha-value>)",
          accent: "rgb(var(--admin-accent) / <alpha-value>)",
          "accent-fg": "rgb(var(--admin-accent-fg) / <alpha-value>)",
          hover: "rgb(var(--admin-hover) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Times New Roman", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-mega": ["clamp(40px, 7vw, 72px)", { lineHeight: "1.05", letterSpacing: "-1.92px", fontWeight: "300" }],
        "display-xl": ["clamp(32px, 5vw, 48px)", { lineHeight: "1.08", letterSpacing: "-0.96px", fontWeight: "300" }],
        "display-lg": ["clamp(28px, 4vw, 36px)", { lineHeight: "1.17", letterSpacing: "-0.36px", fontWeight: "300" }],
        "display-md": ["32px", { lineHeight: "1.13", letterSpacing: "-0.32px", fontWeight: "300" }],
        "display-sm": ["24px", { lineHeight: "1.2", letterSpacing: "0", fontWeight: "300" }],
      },
      borderRadius: {
        pill: "9999px",
        xxl: "24px",
      },
      boxShadow: {
        soft: "0 4px 16px rgba(0,0,0,0.04)",
        lift: "0 10px 32px rgba(0,0,0,0.08)",
        glass: "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        section: "96px",
        "section-sm": "64px",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
        liquid: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "orb-drift": "orbDrift 22s ease-in-out infinite",
        "orb-drift-slow": "orbDrift 36s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        orbDrift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "33%": { transform: "translate3d(40px,-30px,0) scale(1.08)" },
          "66%": { transform: "translate3d(-30px,20px,0) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
