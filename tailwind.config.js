/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          red: '#D43530',
          yellow: '#F8BF0E',
          orange: '#FF8A00',
        },
        'page-bg': '#F9F9F9'
      },
      gradientColorStops: {
        'brand-gradient-start': '#FF8A00',
        'brand-gradient-end': '#D43530',
      },
      backgroundImage: {
        'brand-button': 'linear-gradient(270deg, #D43530 0%, #F8BF0E 100%)',
      },
      borderRadius: {
        'brand': '5px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xxs': '0.625rem',
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [
    function({ addBase, addComponents }) {
      addBase({
        'html': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          'text-rendering': 'optimizeLegibility',
          'font-family': 'Inter, system-ui, sans-serif',
        },
        '@media screen and (max-width: 640px)': {
          'html': {
            'font-size': '16px',
          },
        },
        '@supports (-webkit-touch-callout: none)': {
          'body': {
            'letter-spacing': '-0.01em',
          },
        },
      });

      addComponents({
        '.text-mobile-optimized': {
          '@media screen and (max-width: 640px)': {
            'font-size': '16px',
            'letter-spacing': '-0.01em',
            '-webkit-font-smoothing': 'subpixel-antialiased',
          },
        },
      });
    },
  ],
};