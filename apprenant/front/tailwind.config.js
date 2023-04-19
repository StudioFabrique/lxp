/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: { inter: ["Inter"] },
    extend: {},
    colors: {
      "purple-light": "rgba(118, 40, 78, 0.06)",
      "purple-discrete": "rgba(118, 40, 78, 0.4)",
      pink: "#831843",
      white: "#FFFFFF",
    },
  },
  plugins: [require("daisyui")],
};
