/**
 * KULABOUR ENTERPRISE DESIGN TOKENS
 * Source of Truth for the Design System.
 * 
 * Architecture:
 * 1. GlobalTokens: Raw values (Primitive Palette)
 * 2. SemanticTokens: Alias mapped to Primitives (Theming Layer)
 */

export const GlobalTokens = {
    colors: {
        // Brand Colors
        royalBlue: {
            50: '#F0F6FC',
            100: '#E1ECF9',
            200: '#C2DAF3',
            300: '#94BFEA',
            400: '#5A9BD5',
            500: '#1A3B5D', // Brand Primary
            600: '#15304B',
            700: '#10253A',
            800: '#0C1A29',
            900: '#071019',
        },
        vibrantOrange: {
            50: '#FFF5F0',
            100: '#FFE6D9',
            200: '#FFCAA6',
            300: '#FFA066',
            400: '#FF8040',
            500: '#FF6B35', // Brand Accent
            600: '#E65220',
            700: '#CC3D14',
            800: '#992E0F',
            900: '#661F0A',
        },
        // Neutrals (Slate)
        neutral: {
            0: '#FFFFFF',
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#020617',
        },
        // Feedback
        success: '#10B981', // Emerald 500
        warning: '#F59E0B', // Amber 500
        error: '#EF4444',   // Red 500
        info: '#3B82F6',    // Blue 500
    },
    spacing: {
        0: 0,
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
    },
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 16,
        full: 9999,
    },
} as const;

export const SemanticTokens = {
    colors: {
        brand: {
            primary: GlobalTokens.colors.royalBlue[500],
            secondary: GlobalTokens.colors.royalBlue[700],
            accent: GlobalTokens.colors.vibrantOrange[500],
        },
        surface: {
            base: GlobalTokens.colors.neutral[0],
            subtle: GlobalTokens.colors.neutral[50], // Dashboard Card BG
            muted: GlobalTokens.colors.neutral[100], // Table Headers
            overlay: 'rgba(255, 255, 255, 0.85)',
            glass: 'rgba(255, 255, 255, 0.7)',
        },
        text: {
            primary: GlobalTokens.colors.neutral[900],
            secondary: GlobalTokens.colors.neutral[600],
            tertiary: GlobalTokens.colors.neutral[400],
            inverse: GlobalTokens.colors.neutral[0],
            brand: GlobalTokens.colors.royalBlue[500],
        },
        border: {
            subtle: GlobalTokens.colors.neutral[200], // Card Borders
            default: GlobalTokens.colors.neutral[300], // Input Borders
            strong: GlobalTokens.colors.neutral[400],
            focus: GlobalTokens.colors.royalBlue[400],
        },
        feedback: {
            success: GlobalTokens.colors.success,
            warning: GlobalTokens.colors.warning,
            error: GlobalTokens.colors.error,
            info: GlobalTokens.colors.info,
        }
    },
} as const;
