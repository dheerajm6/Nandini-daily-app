/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#0055A5',
          deep: '#003B73',
          light: '#E8F1FB',
        },
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          red: '#FF3B30',
          orange: '#FF9500',
          gray: {
            1: '#8E8E93',
            2: '#AEAEB2',
            3: '#C7C7CC',
            4: '#D1D1D6',
            5: '#E5E5EA',
            6: '#F2F2F7',
          }
        }
      },
      boxShadow: {
        'ios-card': '0 2px 20px rgba(0, 0, 0, 0.06)',
        'ios-button': '0 4px 16px rgba(0, 85, 165, 0.3)',
        'ios-modal': '0 -4px 40px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.6' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
