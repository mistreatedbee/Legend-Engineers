

/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          DEFAULT: '#F5F4EF',
          50: '#FAFAF7',
          100: '#F5F4EF',
          200: '#EBE9E0',
        },
        ink: {
          DEFAULT: '#0E0E0C',
          soft: '#1A1A17',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#171717',
          border: '#262626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      fontSize: {
        '10xl': ['10rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        '11xl': ['12rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        'editorial': '0.22em',
      },
    },
  },
  plugins: [],
}

