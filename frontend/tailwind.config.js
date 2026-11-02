/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0d080e',
          secondary: '#435430',
        },
        surface: {
          DEFAULT: '#382b3f',
          alt: '#52425c',
        },
        accent: '#7a6284',
        text: {
          primary: '#f7f6f9',
          secondary: '#d7d1dc',
        },
        border: '#52425c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
