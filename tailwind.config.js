/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        success: '#22c55e',
        danger: '#ef4444',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
};


