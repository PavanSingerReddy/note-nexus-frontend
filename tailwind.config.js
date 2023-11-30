/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      animation:{
        // using our custom styles for animation the custom animation is from CustomAnimation.css file
        'custom-fade-up':'custom-fade-up 1s forwards',
      }
    },
  },
  darkMode: "class",
  plugins: [
    require("tw-elements/dist/plugin.cjs"),
    require('tailwindcss-animated')
    ]
}

