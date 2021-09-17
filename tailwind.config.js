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
      colors: {
        primary: '#f0f0f0',
        white100: '#FFFFFF',
        darkGray: '#303a52',
        lightGray: '#d9dad7',
        font1: '#3f3b3b',
        font2: '#575151',
        font3: '#4A4A4A',
        purple: '#9c1de7',
        lightPurple: '#ba53de',
        primaryRed: '#fc5185',
        lightRed: '#ff304f',
        primaryGreen: '#2cb978',
      },
      inset: {
        '7/12': '58.3333333%',
        '-24rem': '-24rem',
        '24rem': '24rem',
      },
      boxShadow: {
        grayShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
        greenShadow: '0 3px 5px rgb(44, 185, 120)',
        redShadow: '0 3px 5x rgb(255, 48, 79)',
      },
      translate: {
        '7/12': '58.3333333%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
