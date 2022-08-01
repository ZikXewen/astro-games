/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        emoji: [
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Noto Color Emoji"',
        ],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-green-500',
    'bg-yellow-500',
    "after:content-['✕']",
    "after:content-['O']",
  ],
}
