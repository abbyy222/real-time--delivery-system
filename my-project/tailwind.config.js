/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E293B',
        accent: '#F97316',
        light: '#F3F4F6',
        dark: '#111827',
      },
      animation: {
        fadeIn: 'fadeIn 1.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {opacity: 0},
          '100%': {opacity: 1},

          },
        },
      },
    },
    plugins: [],

}

