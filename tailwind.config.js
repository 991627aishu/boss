/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rvu-blue': '#1e3a8a',
        'rvu-gold': '#f59e0b',
        'rvu-teal': '#0f766e',
      },
      fontFamily: {
        'university': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
