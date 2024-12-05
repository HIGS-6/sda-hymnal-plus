/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#e5e7eb',
        secondary: '#7a7a7a',
        highlight: '#374151',
        primaryD: '#2f2f2f',
        secondaryD: '#242423',
        highlightD: '#5c5c5c',
      }
    }
  },
  plugins: []
};