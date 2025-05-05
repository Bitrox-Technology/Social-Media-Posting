/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Ensure this is set to 'class'
  theme: {
    extend: {
      colors: {
        primary: 'rgb(111 66 193 / <alpha-value>)', // Matches bg-primary
        'primary-foreground': 'rgb(255 255 255 / <alpha-value>)',
        background: 'rgb(249 250 251 / <alpha-value>)', // Light mode bg
        foreground: 'rgb(17 24 39 / <alpha-value>)', // Light mode text
      },
    },
  },
  plugins: [],
};