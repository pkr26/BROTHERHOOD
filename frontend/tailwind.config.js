/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Active Theme: Slate & Emerald (Professional/Bold)
        primary: {
          DEFAULT: '#475569',  // Slate Gray
          light: '#64748B',
          lighter: '#94A3B8',
          dark: '#334155',
          darker: '#1E293B',
        },
        accent: {
          DEFAULT: '#10B981',  // Emerald Green
          light: '#34D399',
          lighter: '#6EE7B7',
          dark: '#059669',
          darker: '#047857',
        },
        // Supporting Colors
        earth: {
          DEFAULT: '#8B6F47',
          light: '#A08567',
          dark: '#6B5537',
        },
        forest: {
          DEFAULT: '#4A6741',
          light: '#5E8052',
          dark: '#3A5331',
        },
        stone: {
          DEFAULT: '#6C757D',
          light: '#8A939B',
          dark: '#4E565D',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#43A047',
          light: '#66BB6A',
          lighter: '#A5D6A7',
          dark: '#388E3C',
        },
        warning: {
          DEFAULT: '#FFB300',
          light: '#FFD54F',
          lighter: '#FFECB3',
          dark: '#FF8F00',
        },
        danger: {
          DEFAULT: '#E65252',
          light: '#EF6B6B',
          lighter: '#FFCDD2',
          dark: '#D32F2F',
        },
        info: {
          DEFAULT: '#5B92B5',
          light: '#81B9DB',
          lighter: '#B3D7E8',
          dark: '#3E7A9E',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px var(--tw-shadow-color, rgba(71, 85, 105, 0.5))' },
          '50%': { boxShadow: '0 0 20px var(--tw-shadow-color, rgba(71, 85, 105, 0.8))' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.05)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.05)' },
          '40%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.12)',
        'primary': '0 4px 16px rgba(71, 85, 105, 0.25)',
        'accent': '0 4px 16px rgba(16, 185, 129, 0.3)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
