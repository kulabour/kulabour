/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds - exact spec colors
        'dark-navy': '#0A0F1A',
        'dark-charcoal': '#11151E',
        'dark-obsidian': '#0C0E14',
        'surface-deep': '#0C0E14',

        // Neon accents - exact spec colors
        'neon-blue': '#2D73FF',
        'accent-blue': '#2D73FF',
        'neon-teal': '#1CC9A0',
        'accent-teal': '#1CC9A0',
        'neon-green': '#00FFAF',
        'accent-neon-green': '#00FFAF',

        // Status colors
        success: '#00FFAF',
        warning: '#FFB020',
        error: '#FF4D6D',
        info: '#2D73FF',

        // Glass surfaces with varying opacity
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-blue': 'rgba(45, 115, 255, 0.1)',
        'glass-teal': 'rgba(28, 201, 160, 0.08)',
      },
      boxShadow: {
        // Glow effects for interactive elements
        'glow-blue': '0 0 20px rgba(45, 115, 255, 0.5)',
        'glow-blue-lg': '0 0 40px rgba(45, 115, 255, 0.6)',
        'glow-teal': '0 0 20px rgba(28, 201, 160, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 175, 0.5)',
        'glow-green-lg': '0 0 40px rgba(0, 255, 175, 0.6)',
        'glow-red': '0 0 20px rgba(255, 77, 109, 0.5)',
        'glow-yellow': '0 0 20px rgba(255, 176, 32, 0.5)',

        // Cinematic shadows for depth
        'card-float': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.6)',
        'card-3d': '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.3)',
        'soft': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'medium': '0 8px 24px rgba(0, 0, 0, 0.3)',
        'hard': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        glass: '12px',
        'glass-lg': '16px',
        'glass-xl': '24px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'card': '16px',
        'card-lg': '24px',
        'pill': '999px',
      },
      spacing: {
        // iOS grid spacing
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        // Geometric sans-serif family
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-in',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
