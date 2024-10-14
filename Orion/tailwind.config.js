/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        dark: {
          foreground: '#0a0a0a', 
          background: '#0f0f10', 
          text: '#fff', 
          hover: '#212121', 
          inputBackground: '#2f2f2f', 
          inputTextColor: '#b4b4b4', 
					user: '#ff6c6c',
					bot:'#ffbd45'
        },
        light: {
          foreground: '#f9f9f9',
          background: '#fff', 
          text: '#374151', 
          hover: '#E5E7EB', 
          inputBackground: '#F3F4F6', 
          inputTextColor: '#374151', 
					user: '',
					bot:''
        },
      },
    }
  },
  plugins: [
		require("tailwindcss-animate"),
	],
}
