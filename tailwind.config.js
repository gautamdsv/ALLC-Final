/** @type {import('tailwindcss').Config} */
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
import daisyui from 'daisyui';

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ALLC Core Palette
        navy:       '#062926',   // Deep teal
        'teal-pale': '#DCF4F1',  // Light mint background
        'teal-mid':  '#2AB5A5',  // Teal accent
        'teal-light': '#C8EDE9', // Light teal
        'rose-gold': '#2AB5A5',  // Accent (teal)
        'soft-white': '#062926', // Text color
        muted:       '#4A7C78',  // Muted text
        // Keep background alias for index.css @apply
        background: '#DCF4F1',
        'on-surface': '#062926',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2AB5A5 0%, #062926 100%)',
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blob: "blob 7s infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1.2)",
          },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [
    addVariablesForColors,
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        clinical: {
          "primary": "#2AB5A5",
          "secondary": "#DCF4F1",
          "accent": "#062926",
          "neutral": "#C8EDE9",
          "base-100": "#DCF4F1",
        },
      },
    ],
  },
};
