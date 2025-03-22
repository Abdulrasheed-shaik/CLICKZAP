/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {},
		  screens: {
			mobile: { min: "320px", max: "480px" },
			tablet: { min: "481px", max: "768px" },
			laptop: { min: "769px", max: "1024px" },
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
