/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#000000',
          dark: '#0a0a0a',
          darker: '#050505',
          blue: '#00ffff',
          green: '#00ff41',
          purple: '#9d00ff',
          red: '#ff0055',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 255, 255, 0.5)',
        'cyber-lg': '0 0 40px rgba(0, 255, 255, 0.7)',
        'cyber-green': '0 0 20px rgba(0, 255, 65, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
          'to': { textShadow: '0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff' }
        }
      }
    },
  },
  plugins: [],
}