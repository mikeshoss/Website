/** @type {import('tailwindcss').Config} */
export default {
  // Only the file types that actually emit markup. The .ts modules under src/
  // hold content and API code, and Tailwind's scanner would otherwise pull
  // stray utilities out of ordinary prose in them (e.g. the word "static").
  content: ['./src/**/*.{astro,html,md,mdx}'],
  theme: {
    extend: {
      // Warm ink rather than pure black, bone rather than pure white, and one
      // accent. Amber is a signal colour — fitting for a site whose thesis is
      // "work where being wrong is expensive" — and it reads warm against the
      // ink instead of the default blue-on-black of every developer portfolio.
      colors: {
        ink: {
          DEFAULT: '#0b0a09',
          50: '#12100e',
          100: '#181613',
          200: '#221f1b',
        },
        line: {
          DEFAULT: '#28241f',
          strong: '#3a352e',
        },
        bone: {
          DEFAULT: '#f3efe6',
          dim: '#c9c2b5',
        },
        muted: '#847d72',
        accent: {
          DEFAULT: '#f0b429',
          bright: '#ffc94d',
          dim: '#c08f1c',
          ink: '#0b0a09',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display sizes are fluid: the hero headline should fill a phone's
        // width and a desktop's without a breakpoint jump between them.
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.75rem, 3.2vw, 2.75rem)', { lineHeight: '1.08' }],
        'display-sm': ['clamp(1.375rem, 2.2vw, 1.875rem)', { lineHeight: '1.15' }],
      },
      maxWidth: {
        page: '72rem',
        prose: '42rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
