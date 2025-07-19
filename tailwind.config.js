// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // if using /pages
    "./app/**/*.{js,ts,jsx,tsx}",   // if using /app (App Router)
    "./components/**/*.{js,ts,jsx,tsx}", // if you have components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
