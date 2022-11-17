/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'th-background': 'var(--background)!important',
        'th-background-secondary': 'var(--background-secondary)!important',
        'th-background-third': 'var(--background-third)!important',
        'th-foreground': 'var(--foreground)!important',
        'th-foreground-secondary': 'var(--foreground-secondary)!important',
        'th-accent-dark': 'var(--accent-dark)!important',
        'th-accent-medium': 'var(--accent-medium)!important',
        'th-accent-light': 'var(--accent-light)!important',
        'th-accent-vlight': 'var(--accent-vlight)!important',
      }
    },
  },
  plugins: [],
}
