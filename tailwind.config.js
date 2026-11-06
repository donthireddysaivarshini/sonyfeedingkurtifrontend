/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50, #FDF6F5)',
          100: 'var(--brand-100, #F9ECE9)',
          200: 'var(--brand-200, #F3D5D0)',
          300: 'var(--brand-300, #E7B0A8)',
          400: 'var(--brand-400, #D5867B)',
          500: 'var(--brand-500, #B75245)',
          600: 'var(--brand-600, #963B30)',
          700: 'var(--brand-700, #7A2832)', // Primary Wine/Burgundy
          800: 'var(--brand-800, #611C24)',
          900: 'var(--brand-900, #4A131A)',
          DEFAULT: 'var(--brand-primary, #7A2832)',
          accent: 'var(--brand-accent, #C87D7D)',
          gold: 'var(--brand-gold, #C5A059)',
        },
        ivory: {
          50: 'var(--ivory-50, #FDFBF7)',
          100: 'var(--ivory-100, #FAF7F2)',
          200: 'var(--ivory-200, #F4EFEA)',
          300: 'var(--ivory-300, #EEE7DE)',
          400: 'var(--ivory-400, #E4D9CC)',
          DEFAULT: 'var(--ivory-bg, #FDFBF7)',
        },
        ink: {
          primary: 'var(--text-primary, #231F20)',
          secondary: 'var(--text-secondary, #5C5552)',
          muted: 'var(--text-muted, #8A817D)',
          light: 'var(--text-light, #B3AAA5)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(35, 31, 32, 0.05)',
        'card': '0 2px 12px 0 rgba(122, 40, 50, 0.06)',
        'card-hover': '0 12px 28px -4px rgba(122, 40, 50, 0.12)',
        'dropdown': '0 10px 30px -5px rgba(35, 31, 32, 0.15)',
      },
      borderRadius: {
        'pill': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
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

