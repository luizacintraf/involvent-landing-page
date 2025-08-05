/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a651',
          hover: '#008c44',
        },
        secondary: {
          DEFAULT: '#f7941d',
          hover: '#e07c0f',
        },
      },
      fontFamily: {
        display: ['"Lilita One"', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 