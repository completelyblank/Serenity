/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
  plugins: [],
}
