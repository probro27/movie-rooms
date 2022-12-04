/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'netflix': '#E50914'
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
