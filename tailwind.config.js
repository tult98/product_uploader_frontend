module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '1px': '0.1rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
