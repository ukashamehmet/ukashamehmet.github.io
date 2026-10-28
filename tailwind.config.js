/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F19', obsidian: '#0F1524', panel: '#131A2B', line: '#1F2A40',
        fg: '#E6EDF6', muted: '#93A1B8', dim: '#6B7A93',
        neon: '#00FF87', cyan: '#22D3EE', amber: '#FBBF24', crit: '#FF4D6D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
