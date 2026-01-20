import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      'Scheherazade_New': ['var(--font-Scheherazade_New)', 'serif'],
      'english': ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },
    extend: {
      // Extended Color Palette
      colors: {
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',
          600: '#b8960f',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
      },
      
      // Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': `
          radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 30%),
          radial-gradient(at 0% 50%, rgba(212, 175, 55, 0.03) 0px, transparent 40%),
          linear-gradient(to bottom, #0a0a0b, #111113)
        `,
      },
      
      // Typography Scale
      fontSize: {
        'arabic-sm': ['1.125rem', { lineHeight: '2.2' }],
        'arabic-base': ['1.375rem', { lineHeight: '2.4' }],
        'arabic-lg': ['1.625rem', { lineHeight: '2.4' }],
        'arabic-xl': ['1.875rem', { lineHeight: '2.4' }],
        'arabic-2xl': ['2.25rem', { lineHeight: '2.3' }],
        'arabic-3xl': ['2.75rem', { lineHeight: '2.2' }],
      },
      
      // Letter Spacing
      letterSpacing: {
        'arabic': '0.01em',
        'ui-tight': '-0.02em',
        'ui-normal': '-0.01em',
      },
      
      // Line Heights for Arabic
      lineHeight: {
        'arabic': '2.4',
        'arabic-relaxed': '2.6',
        'arabic-loose': '2.8',
      },
      
      // Animations
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'ripple': 'ripple 0.6s linear forwards',
        'confetti': 'confetti-fall 3s ease-out forwards',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      
      // Keyframes
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 30px -5px rgba(16, 185, 129, 0.5)' },
        },
      },
      
      // Box Shadow
      boxShadow: {
        'glow': '0 0 40px -10px rgba(16, 185, 129, 0.4)',
        'glow-sm': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 60px -10px rgba(16, 185, 129, 0.5)',
        'glow-gold': '0 0 40px -10px rgba(212, 175, 55, 0.4)',
        'inner-glow': 'inset 0 0 20px -5px rgba(16, 185, 129, 0.2)',
        'glass': '0 4px 24px -4px rgba(0, 0, 0, 0.5), 0 0 40px -20px rgba(16, 185, 129, 0.1)',
        'glass-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.6), 0 0 60px -20px rgba(16, 185, 129, 0.25)',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
      
      // Transition Timing Function
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      
      // Transition Duration
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      
      // Scale
      scale: {
        '97': '0.97',
        '98': '0.98',
        '102': '1.02',
        '103': '1.03',
      },
      
      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
    },
  },
  plugins: [],
}

export default config
