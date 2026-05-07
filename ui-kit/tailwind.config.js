/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(96% 0.004 100)',
        surface: 'oklch(100% 0 0)',
        fg: 'oklch(15% 0.02 100)',
        muted: 'oklch(40% 0.02 100)',
        border: 'oklch(15% 0.02 100)',
        accent: 'oklch(60% 0.22 25)',
      },
      fontFamily: {
        display: ['"Times New Roman"', '"Iowan Old Style"', 'Georgia', 'serif'],
        body: ['ui-monospace', '"IBM Plex Mono"', '"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      gridTemplateColumns: {
        'asym-70-30': '70% 30%',
        'asym-30-70': '30% 70%',
      },
    },
  },
  plugins: [],
};

