/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sony Collections Royal Plum & Lavender Brand Palette
        cream: {
          50: '#FAF5FC',  // Soft lavender page backdrop
          100: '#F4EAF8',
          200: '#EADBF2',
          300: '#DBC3E7',
        },
        maroon: {
          400: '#AE69B3',
          500: '#944799',
          600: '#833888',
          700: '#6B296F',
          800: '#552058',  // Primary Royal Plum (#552058)
          900: '#3E1541',
          950: '#2A0C2D',
        },
        saffron: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#E58B12',  // Warm gold accent for ratings & highlights
          600: '#D97706',
          700: '#B45309',
        },
        // Harmonized Plum & Lavender Brand Scale
        brand: {
          50: '#F8F2FB',
          100: '#EFE3F5',
          200: '#E2C9E5',
          300: '#CBA0CE',
          400: '#AE69B3',
          500: '#944799',
          600: '#833888',
          700: '#6B296F',
          800: '#552058',
          900: '#3E1541',
          DEFAULT: '#552058',
          accent: '#944799',
          gold: '#E58B12',
        },
        ivory: {
          50: '#FAF5FC',
          100: '#F6EEF9',
          200: '#EFE3F5',
          300: '#E5D3ED',
          400: '#D7BCE2',
          DEFAULT: '#FAF5FC',
        },
        ink: {
          primary: '#1E1621',
          secondary: '#524457',
          muted: '#74647A',
          light: '#A595AB',
        },
      },
      fontFamily: {
        // GSS font pairing: Karla for body, Fraunces for display/headings
        sans: ['Karla', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'xs': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'soft': '0 4px 20px -2px rgba(35, 31, 32, 0.05)',
        'card': '0 2px 12px 0 rgba(63, 15, 30, 0.06)',
        'card-hover': '0 12px 28px -4px rgba(63, 15, 30, 0.12)',
        'dropdown': '0 10px 30px -5px rgba(35, 31, 32, 0.15)',
      },
      borderRadius: {
        'xs': '2px',
        'pill': '9999px',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'marquee-fast': 'marquee 14s linear infinite',
        'marquee-slow': 'marquee 32s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
