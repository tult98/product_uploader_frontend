module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      '80px': '8rem',
    },
    minHeight: {
      '30px': '3rem',
    },
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
