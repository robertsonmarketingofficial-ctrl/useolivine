/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f5f7f0',
          100: '#e8edda',
          200: '#cfdbb7',
          300: '#afc28a',
          400: '#8ba55e',
          500: '#6d8a40',
          600: '#556d30',
          700: '#435528',
          800: '#374523',
          900: '#2f3b1f',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
