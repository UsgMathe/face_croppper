/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      colors: {
        'default-black': '#121212',
        'default-gray': '#292929',
        'usgmathe': '#662a67',
        'usgmathe-hover': '#41263e',
        'pormade-red': '#E44747',
        'default': '#1E1E1E',
        'input': '#D9D9D9',
        'input-text': '#515151',
        'error-bg': '#670000',
        'error-main': '#DF1515',
      },
    },
  },
  plugins: [],
}
