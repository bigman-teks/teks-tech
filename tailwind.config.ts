import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { charcoal: "#0B0F14", navy: "#0F172A", electric: "#2563EB", bright: "#3B82F6", mist: "#F8FAFC", slate2: "#64748B" },
    fontFamily: { sans: ["var(--font-inter)"], display: ["var(--font-grotesk)"], mono: ["var(--font-mono)"] },
    boxShadow: { glow: "0 0 40px -10px rgba(37,99,235,.45)" },
  } },
} satisfies Config;
