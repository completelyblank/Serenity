/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  darkMode: 'class', // Enable dark mode via a class
  
  theme: {
    extend: {
      fontFamily: {
        'Moonshine': ['Moonshine', 'sans-serif'],
        'Poppins': ['Poppins', 'sans-serif'],
        'PoppinsBold': ['PoppinsBold', 'sans-serif'],
        'CoolVetica': ['CoolVetica', 'sans-serif'],
        'KgTen': ['KgTen', 'sans-serif'],
        'DirtyHeadline': ['DirtyHeadline', 'sans-serif']
      },
    },
  },
  
  variants: {
    extend: {},
  },
  
  plugins: [],
};
