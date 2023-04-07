/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        SuisseIntl: ["Suisse Intl", "sans-serif"],
        Sanomat: ["Sanomat", "sans-serif"],
      },
      colors: {
        "yellow-light": "#FFE3CA",
        yellow: "#FDA739",
        secondary: "#1E1E1E",
        gray: "#C7C7C7",
        light: "#FAFAF9",
        red: "#FF255A",
        green: "#34D399",
        "gray-1": "#BBBFC6",
      },
      fontSize: {
        "1.5xl": "22px",
        "2.5xl": "32px",
      },
      spacing: {
        3.5: "14px",
        4.5: "18px",
        5.5: "22px",
        7.5: "30px",
        12.5: "50px",
        15: "60px",
        25: "100px",
      },
      gap: {
        15: "60px",
      },
      opacity: {
        45: ".45",
      },
      boxShadow: {
        sm: "inset 0px 4px 70px 30px rgba(0, 0, 0, 0.7)",
      },
      dropShadow: {
        sm: "0px 0px 5px rgba(255, 255, 255, 0.6)",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
