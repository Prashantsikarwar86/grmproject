/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Brand green inspired by Deshwal logo
          DEFAULT: '#2BB673',
          foreground: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#00AEEF',
        }
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [],
};


