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
          navy: '#000518',
          saffron: '#fe6a2a',
          gold: '#D4A843',
          surface: '#f8f9fa',
          card: '#ffffff',
          muted: '#6B7280',
          border: '#E5E7EB',
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
        soft: '0 20px 45px rgba(0, 5, 24, 0.08)',
        card: '0 12px 30px rgba(0, 5, 24, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
