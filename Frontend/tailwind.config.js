// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',   // azul mais escuro
        secondary: '#3B82F6', // azul claro
        danger: '#DC2626',    // vermelho
      }
    },
  },
  plugins: [],
};
