/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '8px',
      },
      colors: {
        primary: {
          DEFAULT: '#111844',
          dark: '#0a0f30',
          light: '#e4e8f2',
        },
        secondary: '#7288AE',
        success: {
          DEFAULT: '#2d7d46',
          light: '#e8f5ed',
        },
        warning: {
          DEFAULT: '#a6701e',
          light: '#fdf3e0',
        },
        danger: {
          DEFAULT: '#b91c1c',
          light: '#fde8e8',
        },
        info: {
          DEFAULT: '#4B5694',
          light: '#eef0f7',
        },
        bg: '#F4F3EE',
        'text-secondary': '#4B5694',
        border: '#d0d6e4',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(17,24,68,0.06), 0 1px 2px rgba(17,24,68,0.04)',
        'card-lg': '0 4px 12px rgba(17,24,68,0.08), 0 2px 4px rgba(17,24,68,0.04)',
        hard: '0 2px 0 rgba(17,24,68,0.08)',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease',
        fadeIn: 'fadeIn 0.3s ease',
      },
    },
  },
  plugins: [],
}
