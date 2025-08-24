/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#9B4521',
          light: '#C7683A', 
          dark: '#7F361B',
          50: '#FEF9F6',
          100: '#FDF0E7',
          200: '#F9DCC7',
          300: '#F4C3A0',
          400: '#EC9D6D',
          500: '#C7683A',
          600: '#9B4521',
          700: '#7F361B',
          800: '#662B16',
          900: '#4D2011'
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
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
        '6xl': ['3.75rem', { lineHeight: '1' }]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(155, 69, 33, 0.08), 0 10px 20px -2px rgba(155, 69, 33, 0.04)',
        'medium': '0 4px 25px -5px rgba(155, 69, 33, 0.15), 0 20px 25px -5px rgba(155, 69, 33, 0.08)',
        'strong': '0 8px 35px -5px rgba(155, 69, 33, 0.25), 0 25px 30px -10px rgba(155, 69, 33, 0.15)',
        'glow': '0 0 20px rgba(155, 69, 33, 0.15)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'scale(1)' },
          '40%, 43%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(1.02)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}