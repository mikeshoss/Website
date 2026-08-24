/** @type {import('tailwindcss').Config} */
export default {
  // Only the file types that actually emit markup. The .ts modules under src/
  // hold content and API code, and Tailwind's scanner would otherwise pull
  // stray utilities out of ordinary prose in them (e.g. the word "static").
  content: ['./src/**/*.{astro,html,md,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0a0a0a',
          50: '#111111',
          100: '#1a1a1a',
          200: '#222222',
        },
        accent: {
          DEFAULT: '#3b82f6',
          dim: '#2563eb',
        },
        muted: '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
