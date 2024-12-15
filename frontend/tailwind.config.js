/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transit_white: "#F4F2F4",
        transit_blue: "#04529C",
        transit_pink: "#BC228C", 
        transit_orange: "#F4823C", 
        transit_red: "#EC764C", 
        transit_black: "#091a28",  
        normal_text: "#faf5ee", 
        highlight_text: "#6892b8" 
      },
    },
  },
  plugins: [],
};
