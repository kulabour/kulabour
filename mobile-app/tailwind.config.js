/** @type {import('tailwindcss').Config} */
const { GlobalTokens, SemanticTokens } = require('./theme/tokens');

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Token Mapping (Dynamic via CSS Vars)
        brand: {
          primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-brand-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-brand-accent) / <alpha-value>)',
        },
        surface: {
          base: 'rgb(var(--color-surface-base) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          // Special case for overlay/glass which might not need alpha variable if hardcoded in var
          // But our var is just rgb channels, so we can use opacity.
          glass: 'rgb(var(--color-surface-glass) / 0.7)', // Enforce 0.7 opacity for glass
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
          brand: 'rgb(var(--color-text-brand) / <alpha-value>)',
        },
        border: {
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
          default: 'rgb(var(--color-border-default) / <alpha-value>)',
          strong: 'rgb(var(--color-border-default) / <alpha-value>)', // Fallback or separate var
          focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
        },
        feedback: {
          success: 'rgb(var(--color-feedback-success) / <alpha-value>)',
          warning: 'rgb(var(--color-feedback-warning) / <alpha-value>)',
          error: 'rgb(var(--color-feedback-error) / <alpha-value>)',
          info: 'rgb(var(--color-feedback-info) / <alpha-value>)',
        }
      },
      spacing: {
        // Enforcing 8pt Grid from GlobalTokens
        0: '0px',
        xs: `${GlobalTokens.spacing.xs}px`,   // 4px
        sm: `${GlobalTokens.spacing.sm}px`,   // 8px
        md: `${GlobalTokens.spacing.md}px`,   // 16px
        lg: `${GlobalTokens.spacing.lg}px`,   // 24px
        xl: `${GlobalTokens.spacing.xl}px`,   // 32px
        '2xl': `${GlobalTokens.spacing['2xl']}px`, // 48px
        '3xl': `${GlobalTokens.spacing['3xl']}px`, // 64px
      },
      borderRadius: {
        sm: `${GlobalTokens.borderRadius.sm}px`, // 4px
        md: `${GlobalTokens.borderRadius.md}px`, // 8px
        lg: `${GlobalTokens.borderRadius.lg}px`, // 16px
        full: '9999px',
      },
      boxShadow: {
        // Fluent Depth System (Retained but renamed for semantic clarity if needed)
        'elevation-sm': '0 0.3px 0.9px rgba(0,0,0,0.108), 0 1.6px 3.6px rgba(0,0,0,0.132)',
        'elevation-md': '0 1.2px 3.6px rgba(0,0,0,0.108), 0 6.4px 14.4px rgba(0,0,0,0.132)',
        'elevation-lg': '0 9.6px 28.8px rgba(0,0,0,0.108), 0 51.2px 115.2px rgba(0,0,0,0.132)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'System', 'sans-serif'], // Prioritize Custom Fonts
      },
    },
  },
  plugins: [],
}
