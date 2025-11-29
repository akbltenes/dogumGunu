/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#ee2b5b',
        'background-light': '#f8f6f6',
        'background-dark': '#221015',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Noto Sans"', 'sans-serif'],
        romantic: ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

