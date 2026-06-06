/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cores base como canais RGB (alpha-aware) — sobrescritas em runtime via CSS vars.
        // Permite usar modificadores de opacidade: bg-brand/10, shadow-brand/20, etc.
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          light: 'rgb(var(--accent-light) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
      },
    },
  },
  plugins: [],
}
