/**
 * KULABOUR Design System
 * Central source of truth for the app's visual language.
 * Designed for "Next Billion Users" with high contrast and accessible sizing.
 */

export const COLORS = {
    // Primary Brand Colors
    primary: '#0078D4', // Trust Blue
    primaryDark: '#005A9E',
    primaryLight: '#EFF6FC',

    // Functional Colors
    success: '#10B981', // Green for success/money
    warning: '#F59E0B', // Amber for alerts
    danger: '#EF4444',  // Red for destructive actions
    info: '#3B82F6',    // Blue for information

    // Neutrals
    text: '#111827',       // Near black for primary text
    textSecondary: '#4B5563', // Dark gray for secondary text
    textTertiary: '#9CA3AF',  // Light gray for placeholders
    background: '#F3F4F6',    // App background
    surface: '#FFFFFF',       // Card background
    border: '#E5E7EB',        // Divider color
};

export const SPACING = {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
};

export const RADIUS = {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
};

export const TYPOGRAPHY = {
    // Font Weights
    regular: '400',
    medium: '500',
    bold: '700',
    heavy: '900',

    // Sizes
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
};
