/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx,jsx,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
      "azul-corporacion": "#32A850",
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('flowbite/plugin'),
  ],
}