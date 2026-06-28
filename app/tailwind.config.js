/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        narges: {
          // ألوان نظام التصميم (Narjis Design System)
          green: '#2E7D32',        // الأساسي — أزرار وروابط
          'green-deep': '#1B5E20', // بداية التدرّجات
          'green-mid': '#2E7D32',
          light: '#4CAF50',        // لمسات ثانوية
          lighter: '#66BB6A',
          orange: '#FF7A00',       // العروض والتنبيهات
          'orange-light': '#FF9D3D',
          bg: '#F7F8FA',
          surface: '#FFFFFF',
          surface2: '#F1F3F6',
          border: '#ECEEF1',
          text: '#16191D',
          'text-secondary': '#5B6470',
          muted: '#9AA3AE',
        }
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'narges': '0 8px 22px rgba(17,24,39,.07)',
        'narges-sm': '0 2px 8px rgba(17,24,39,.05)',
        'narges-green': '0 8px 18px rgba(46,125,50,.38)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
