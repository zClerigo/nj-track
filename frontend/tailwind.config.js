/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  darkMode: 'selector',
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
      boxShadow: {
        'elevation-low-dark': [
          '0px 0.9px 1px hsl(208deg 100% 2% / 0.34)',
          '-0.1px 1.5px 1.7px -1.2px hsl(208deg 100% 2% / 0.34)',
          '-0.1px 3.6px 4.1px -2.5px hsl(208deg 100% 2% / 0.34)',
        ].join(', '),
        'elevation-medium-dark': [
          '0px 0.9px 1px hsl(208deg 100% 2% / 0.36)',
          '-0.1px 3px 3.4px -0.8px hsl(208deg 100% 2% / 0.36)',
          '-0.3px 7.5px 8.4px -1.7px hsl(208deg 100% 2% / 0.36)',
          '-0.6px 18.2px 20.5px -2.5px hsl(208deg 100% 2% / 0.36)',
        ].join(', '),
        'elevation-high-dark': [
          '0px 0.9px 1px hsl(208deg 100% 2% / 0.34)',
          '-0.2px 5.3px 6px -0.4px hsl(208deg 100% 2% / 0.34)',
          '-0.3px 9.9px 11.1px -0.7px hsl(208deg 100% 2% / 0.34)',
          '-0.6px 16.3px 18.3px -1.1px hsl(208deg 100% 2% / 0.34)',
          '-0.9px 26px 29.3px -1.4px hsl(208deg 100% 2% / 0.34)',
          '-1.4px 40.6px 45.7px -1.8px hsl(208deg 100% 2% / 0.34)',
          '-2.1px 61.7px 69.5px -2.1px hsl(208deg 100% 2% / 0.34)',
          '-3.1px 90.9px 102.3px -2.5px hsl(208deg 100% 2% / 0.34)',
        ].join(', '), 
        'elevation-low-light': [
          '0px 0.9px 1px hsl(300deg 3% 60% / 0.34)',
          '-0.1px 1.5px 1.7px -1.2px hsl(300deg 3% 60% / 0.34)',
          '-0.1px 3.6px 4.1px -2.5px hsl(300deg 3% 60% / 0.34)',
        ].join(', '),
        'elevation-medium-light': [
          '0px 0.9px 1px hsl(300deg 3% 60% / 0.36)',
          '-0.1px 3px 3.4px -0.8px hsl(300deg 3% 60% / 0.36)',
          '-0.3px 7.5px 8.4px -1.7px hsl(300deg 3% 60% / 0.36)',
          '-0.6px 18.2px 20.5px -2.5px hsl(300deg 3% 60% / 0.36)',
        ].join(', '),
        'elevation-high-light': [
          '0px 0.9px 1px hsl(300deg 3% 60% / 0.34)',
          '-0.2px 5.3px 6px -0.4px hsl(300deg 3% 60% / 0.34)',
          '-0.3px 9.9px 11.1px -0.7px hsl(300deg 3% 60% / 0.34)',
          '-0.6px 16.3px 18.3px -1.1px hsl(300deg 3% 60% / 0.34)',
          '-0.9px 26px 29.3px -1.4px hsl(300deg 3% 60% / 0.34)',
          '-1.4px 40.6px 45.7px -1.8px hsl(300deg 3% 60% / 0.34)',
          '-2.1px 61.7px 69.5px -2.1px hsl(300deg 3% 60% / 0.34)',
          '-3.1px 90.9px 102.3px -2.5px hsl(300deg 3% 60% / 0.34)',
        ].join(', ')
      }, 
      dropShadow: {
        'elevation-low-dark': '0 1px 1px hsl(208deg 100% 2% / 0.3)',
        'elevation-medium-dark': '0 3px 4px hsl(208deg 100% 2% / 0.3)',
        'elevation-high-dark': '0 5px 6px hsl(208deg 100% 2% / 0.3)',
        'elevation-low-light': '0 1px 1px hsl(300deg 3% 60% / 0.3)',
        'elevation-medium-light': '0 3px 4px hsl(300deg 3% 60% / 0.3)',
        'elevation-high-light': '0 5px 6px hsl(300deg 3% 60% / 0.3)',
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [  
    function ({ addVariant }) {
      addVariant('light', 'body:not(.dark) &')
    }
  ],
};
