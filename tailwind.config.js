module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minWidth: {
        '80px': '8rem',
        '150px': '150px',
        '200px': '20rem',
      },
      minHeight: {
        '30px': '3rem',
        '400px': '40rem',
      },
      maxHeight: {
        '400px': '40rem',
        '500px': '50rem',
        '600px': '60rem',
      },
      spacing: {
        '400px': '40rem',
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
        primaryBlue: '#482ff7',
        primaryRed: '#fc5185',
        lightRed: '#ff304f',
        primaryGreen: '#2cb978',
      },
      inset: {
        '7/12': '58.3333333%',
        '-24rem': '-24rem',
        '24rem': '24rem',
        38: '38%',
        44: '44%',
      },
      boxShadow: {
        grayShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
        greenShadow: '0 3px 5px rgba(44, 185, 120, 0.8)',
        redShadow: '0 3px 5x rgba(255, 48, 79, 0.8)',
      },
      translate: {
        '7/12': '58.3333333%',
        38: '38%',
        44: '44%',
      },
      width: {
        '9/20': '45%',
        '47.5%': '47.5%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
