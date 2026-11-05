/** @type {import('tailwindcss').Config} */
export default {
  // Only the file types that actually emit markup. The .ts modules under src/
  // hold content and API code, and Tailwind's scanner would otherwise pull
  // stray utilities out of ordinary prose in them (e.g. the word "static").
  content: ['./src/**/*.{astro,html,md,mdx}'],
  theme: {
    extend: {
      // Dieter Rams / Braun: warm paper, carbon type, one signal orange, and a
      // green "on" light for what is live right now. The token names are
      // semantic and predate the palette — `ink` is the page surface and
      // `bone` the type — so every page picks the palette up without edits.
      // `carbon` is the one dark surface: the machine room, like the black
      // top plate on an SK4.
      colors: {
        ink: {
          DEFAULT: '#edeae3',
          50: '#e5e1d8',
          100: '#dcd7cc',
          200: '#d2ccbf',
        },
        line: {
          DEFAULT: '#cfc9bd',
          strong: '#a9a397',
        },
        bone: {
          DEFAULT: '#1b1a18',
          dim: '#46433d',
        },
        muted: '#68635b',
        accent: {
          DEFAULT: '#e0520f',
          bright: '#f0661f',
          // Small orange text on paper and on the darker panels (5.2:1 / 4.8:1).
          dim: '#a83d0a',
          // Text on orange: a hair deeper than carbon so it passes AA (4.84:1).
          ink: '#111110',
        },
        signal: '#3f9a46',
        carbon: {
          DEFAULT: '#1b1a18',
          50: '#24221f',
          line: '#3a3732',
          text: '#e9e5dc',
          muted: '#8f897e',
        },
      },
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display sizes are fluid: the hero headline should fill a phone's
        // width and a desktop's without a breakpoint jump between them.
        'display-xl': ['clamp(2.5rem, 6vw, 5.25rem)', { lineHeight: '1.0', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.04', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.625rem, 3vw, 2.5rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.625rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        page: '72rem',
        prose: '42rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
