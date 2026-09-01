/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        jarvis: {
          bg: '#07090E',
          surface: '#0C1017',
          surfaceHover: '#131A24',
          card: '#0E131C',
          border: 'rgba(0, 229, 255, 0.12)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          cyan: '#00E5FF',
          cyanGlow: '#00F2FE',
          cyanMuted: '#008B99',
          cyanDark: 'rgba(0, 229, 255, 0.08)',
          textMuted: '#6B7A90',
          textLight: '#94A3B8',
          textBright: '#F1F5F9',
        }
      },
      boxShadow: {
        'cyan-glow-sm': '0 0 15px -3px rgba(0, 229, 255, 0.35)',
        'cyan-glow': '0 0 25px -2px rgba(0, 229, 255, 0.45)',
        'cyan-glow-lg': '0 0 45px 0px rgba(0, 229, 255, 0.35)',
        'core-glow': '0 0 60px 10px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(0, 229, 255, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse-slow': 'spin-reverse 25s linear infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'equalizer': 'equalizer 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
