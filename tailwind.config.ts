import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "selector",
  theme: {
    extend: {
      transitionProperty: {
        "bg-border": "background-color, border-color"
      },
      screens: {
        xs: "475px",
        ...defaultTheme.screens
      },
      backgroundImage: {
        light: "url('/bg-light.svg')",
        dark: "url('/bg-dark.svg')"
      }
    }
  },
  plugins: []
};
export default config;
