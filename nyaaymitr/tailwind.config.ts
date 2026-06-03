import type { Config } from 'tailwindcss';

const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nyaay: {
          navy: '#132240',
          deep: '#0f1b35',
          panel: '#263754',
          panelSoft: '#30415f',
          saffron: '#ff6b2c',
          saffronLight: '#ffad91',
          gold: '#D9AA3E',
          cream: '#FFE0A8',
          surface: '#132240',
          card: '#263754',
          muted: '#aeb9d4',
          border: '#5f708d',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        devanagari: ['var(--font-noto-devanagari)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(0, 0, 0, 0.35)',
        card: '0 16px 40px rgba(0, 0, 0, 0.25)',
        glow: '0 0 70px rgba(217, 170, 62, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
