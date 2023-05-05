/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1740px",
      },
      fontFamily: {
        SpaceGrotesk: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        "orange-200": "#FFE3CA",
        "orange-300": "#FFCC8A",
        "orange-900": "#FDA739",
        "gray-400": "#878078",
        "gray-700": "#1E1E1E",
        "gray-500": "#44403C",
        "gray-450": "#463A3A",
        "gray-300": "#C9C9C9",
        "gray-200": "#A1A1A1",
        "gray-100": "#D4D4D4",
        "warm-gray-50": "#FAFAF9",
        red: "#FF255A",
        green: "#34D399",
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
        "orange-900": "0px 0px 4px rgba(253, 167, 57, 0.4)",
        card: "0px 0px 4px rgba(255, 255, 255, 0.4)",
        "orange-200": "0px 0px 4px rgba(255, 227, 202, 0.4)",
        black: "inset 0px 4px 50px 15px rgba(0, 0, 0, 0.5)",
      },
      dropShadow: {
        sm: "0px 0px 4px rgba(255, 255, 255, 0.4)",
        "orange-200": "0px 0px 4px rgba(255, 227, 202, 0.4)",
      },
      borderWidth: {
        1: "1px",
      },
      letterSpacing: {
        wide: ".07em",
      },
      blur: {
        default: "2px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
