/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // <-- Added: enable dark mode toggle via class
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Added: custom palettes
        lightTheme: {
          100: '#B8E3E9',
          200: '#93B1B5',
          300: '#4F7C82',
          400: '#0B2E33',
        },
        darkTheme: {
          100: '#070F2B',
          200: '#1B1A55',
          300: '#535C91',
          400: '#9290C3',
        },
      },
    },
  },
  plugins: [],
}
