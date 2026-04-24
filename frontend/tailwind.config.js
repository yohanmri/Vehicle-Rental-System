/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EAB308', // Gold/Yellow like the screenshot
          dark: '#CA8A04',
          light: '#FDE047',
        },
        secondary: {
          DEFAULT: '#1E293B', // Dark blue/slate
          dark: '#0F172A',
          light: '#334155',
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      }
    },
  },
  plugins: [],
}
