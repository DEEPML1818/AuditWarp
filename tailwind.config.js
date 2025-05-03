/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
            'cyber-base': '#d1d5db',
            'cyber-electric': '#0ff',
            'cyber-lime': '#c0f941',
            'cyber-magenta': '#ff00ff',
            'cyber-yellow': '#ffff00',
            'cyber-blue': '#00e0ff',
            'cyber-red': '#ff5555',
            'cyber-border': '#0ff',
          },
        fontFamily: {
          futuristic: ['Orbitron', 'sans-serif'],
        },
        keyframes: {
          pulsate: {
            '0%,100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,255,255,0.7)' },
            '50%':     { opacity: '0.7', boxShadow: '0 0 16px rgba(0,255,255,1)' },
          },
        },
        animation: {
          pulsate: 'pulsate 1.5s ease-in-out infinite',
        },
      },
    },
    variants: {
      extend: {
        animation: ['motion-safe', 'motion-reduce'],
      },
    },
    plugins: [],
  }
  