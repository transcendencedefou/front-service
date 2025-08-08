/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          bg: "var(--bg)",
          fg: "var(fg)",
          clpurple: '#b5a5eb',
          dkpurple: '#22007c',
          accent: {
            1: "var(--accent-1)",
            2: "var(--accent-2)",
            3: "var(--accent-3)",
          }
        },
        backgroundSize: {
          grid: "48px 48px",
        },
        boxShadow: {
          neon: "0 0 8px currentColor, 0 0 22px currentColor"
        },
        fontFamily: { 
          sans: ['"Inclusive Sans"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }