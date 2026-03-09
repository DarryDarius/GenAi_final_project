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
        terracotta: '#c4a08a',
      },
      boxShadow: {
        'soft': '0 4px 24px -4px rgba(0,0,0,0.06)',
        'soft-lg': '0 8px 40px -8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
