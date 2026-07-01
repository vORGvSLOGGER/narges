/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // توكنات نظام التصميم — قائمة على متغيّرات CSS لدعم الوضع الفاتح/الداكن
        narges: {
          green: 'rgb(var(--n-green) / <alpha-value>)',
          'green-deep': '#1B5E20',
          'green-mid': '#2E7D32',
          light: '#4CAF50',
          lighter: '#66BB6A',
          orange: 'rgb(var(--n-orange) / <alpha-value>)',
          'orange-light': '#FF9D3D',
          bg: 'rgb(var(--n-bg) / <alpha-value>)',
          surface: 'rgb(var(--n-surface) / <alpha-value>)',
          surface2: 'rgb(var(--n-surface2) / <alpha-value>)',
          border: 'rgb(var(--n-border) / <alpha-value>)',
          text: 'rgb(var(--n-text) / <alpha-value>)',
          'text-secondary': 'rgb(var(--n-text2) / <alpha-value>)',
          muted: 'rgb(var(--n-muted) / <alpha-value>)',
        }
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'narges': '0 8px 22px rgba(0,0,0,.10)',
        'narges-sm': '0 2px 8px rgba(0,0,0,.08)',
        'narges-green': '0 8px 18px rgba(46,125,50,.38)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(100%)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        bounceIn: { '0%': { transform: 'scale(0.8)', opacity: '0' }, '60%': { transform: 'scale(1.05)', opacity: '1' }, '100%': { transform: 'scale(1)' } },
      }
    },
  },
  plugins: [],
}
