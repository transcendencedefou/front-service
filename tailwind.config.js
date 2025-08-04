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
          clpurple: '#b5a5eb',
          dkpurple: '#22007c',
        }
      },
    },
    plugins: [],
  }