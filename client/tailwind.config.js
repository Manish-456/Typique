

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens : {
        'md' : '830px',
        'lg' : '1025px'
      },
    
       
    },
  },
  plugins: [],
}
