/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false, // or 'media' or 'class'
   theme: {
     extend: {
      animation: {
          appear: 'appear 0.1s ease-in-out',
          expand: 'expand 0.1s ease-in-out'
      },
      keyframes:{  
        appear:{
          '0%': {transform: 'translateX(10%)'},
          '100%': {transform: 'translateX(0)'},
        },
        expand:{
          '0%': {transform: 'translateY(-20%)', opacity: 0},
          '100%': {transform: 'translateY(0)', opacity: 1}
        }
      }
     },
   },
   variants: {
     extend: {
     },
   },
    plugins: []
 }