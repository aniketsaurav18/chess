/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/theme");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|checkbox|input|link|modal|popover|progress|radio|select|slider|spacer|tabs|user|ripple|spinner|listbox|divider|scroll-shadow|avatar).js"
  ],
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1024px'},
      // => @media (max-width: 1024px) { ... }

      'md': {'max': '768px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '500px'},
      // => @media (max-width: 639px) { ... }
    }
  },
  plugins: [nextui()],
}

