/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color - Dark Navy Blue
        primary: {
          50: '#eef1f6',
          100: '#cfd6e4',
          200: '#b0bcd2',
          300: '#91a2bf',
          400: '#7288ad',
          500: '#536d9a',
          600: '#425679',
          700: '#324058',
          800: '#212b37',
          900: '#09122C', // Main dark blue
        },
        // Secondary color - Deep Burgundy
        secondary: {
          50: '#f7e8ed',
          100: '#ebc5d1',
          200: '#dea2b5',
          300: '#d27f99',
          400: '#c55c7d',
          500: '#873341', // Main burgundy
          600: '#6d2934',
          700: '#521f27',
          800: '#36141a',
          900: '#1b0a0d',
        },
        // Accent color - Vibrant Red
        accent: {
          50: '#fde8eb',
          100: '#fac5cd',
          200: '#f7a2af',
          300: '#f47f91',
          400: '#f15c73',
          500: '#BE3144', // Main red
          600: '#982736',
          700: '#721d29',
          800: '#4c141b',
          900: '#260a0e',
        },
        // Complementary color - Coral
        coral: {
          50: '#fff0eb',
          100: '#ffd7cc',
          200: '#ffbead',
          300: '#ffa58e',
          400: '#ff8c6f',
          500: '#E17564', // Main coral
          600: '#b45e50',
          700: '#87463c',
          800: '#5a2f28',
          900: '#2d1714',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': {
            'box-shadow': '0 0 10px rgba(190, 49, 68, 0.4), 0 0 20px rgba(190, 49, 68, 0.2)',
          },
          'to': {
            'box-shadow': '0 0 15px rgba(190, 49, 68, 0.6), 0 0 30px rgba(190, 49, 68, 0.4)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};