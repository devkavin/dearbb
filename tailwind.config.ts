import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: '#f9d8ec',
        sky: '#d7ecff',
        lavender: '#e5ddff'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['"Quicksand"', 'system-ui', 'sans-serif']
      },
      animation: {
        floaty: 'floaty 2.5s ease-in-out infinite',
        pop: 'pop .4s ease-out'
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pop: {
          '0%': { transform: 'scale(.9)', opacity: '.6' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};

export default config;
