/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GSS Clothing Signature Colors
        cream: {
          50: '#FBF7EF',  // GSS warm primary page background (rgb(251, 247, 239))
          100: '#F6EFE2',
          200: '#ECE0CA',
          300: '#DECBA7',
        },
        maroon: {
          400: '#9B2C4E',
          500: '#8A1F3D',
          600: '#7B1832',
          700: '#5A152B',
          800: '#3F0F1E',  // GSS primary brand accent (rgb(63, 15, 30))
          900: '#2D0B15',
          950: '#1A060C',
        },
        saffron: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#E58B12',  // GSS saffron gold accent (#E58B12 / #F59E0B)
          600: '#D97706',
          700: '#B45309',
        },
        // Existing brand palette mapped to harmonize with GSS
        brand: {
          50: '#FDF6F5',
          100: '#F9ECE9',
          200: '#F3D5D0',
          300: '#E7B0A8',
          400: '#D5867B',
          500: '#B75245',
          600: '#7B1832',
          700: '#5A152B',
          800: '#3F0F1E', // GSS Imperial Maroon
          900: '#2D0B15',
          DEFAULT: '#3F0F1E',
          accent: '#C87D7D',
          gold: '#E58B12',
        },
        ivory: {
          50: '#FBF7EF',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EEE7DE',
          400: '#E4D9CC',
          DEFAULT: '#FBF7EF',
        },
        ink: {
          primary: '#1C1917',
          secondary: '#57534E',
          muted: '#78716C',
          light: '#A8A29E',
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
        'marquee': 'marquee 32s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
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
