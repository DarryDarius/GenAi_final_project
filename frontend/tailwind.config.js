/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        cream: '#faf8f5',
        blush: '#e8d5d0',
        sage: '#9ca892',
      },
    },
  },
  plugins: [],
}
