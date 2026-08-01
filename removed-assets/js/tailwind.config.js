/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom spacing used for specific card heights and navigation widths
      spacing: {
        25: '6.25rem', // maps to min-w-25 (100px)
        105: '26.25rem', // maps to min-h-105 (420px)
        115: '28.75rem', // maps to min-h-115 (460px)
      },
      // Custom border radius for the LexiBridge "pill" look
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      // Ensuring the exercise colors are mapped to your themes
      colors: {
        emerald: {
          50: '#ecfdf5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
        },
        purple: {
          50: '#f5f3ff',
          200: '#ddd6fe',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        amber: {
          50: '#fffbeb',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      // Custom animations definition for the exercise transitions
      animation: {
        'bounce-slow': 'bounce 3s linear infinite',
      },
    },
  },
  plugins: [],
};
