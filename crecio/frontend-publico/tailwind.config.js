/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark:      '#0F172A',
        deep:      '#0D9488',
        mid:       '#0F766E',
        primary:   '#14B8A6',
        light:     '#5EEAD4',
        navy:      '#1E293B',
        cream:     '#FAFAF8',
        warm:      '#F5F5F0',
        charcoal:  '#334155',
        'text-muted': '#64748B',
        teal: {
          DEFAULT: '#0D9488',
          dark:    '#0F766E',
          light:   '#14B8A6',
          lighter: '#2DD4BF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontWeight: {
        light:     '300',
        normal:    '400',
        medium:    '500',
        semibold:  '600',
        bold:      '700',
        extrabold: '800',
      },
    },
  },
  plugins: [],
}