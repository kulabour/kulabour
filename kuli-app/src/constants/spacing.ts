/**
 * Spacing scale based on an 8px grid system.
 * Use these tokens everywhere instead of hard-coded pixel values
 * to maintain visual consistency across the app.
 */
export const Spacing = {
  /** 4px – hairline gaps, icon padding */
  xs: 4,
  /** 8px – tight inner padding, small gaps */
  sm: 8,
  /** 12px – default inner padding */
  md: 12,
  /** 16px – standard padding, card insets */
  lg: 16,
  /** 24px – section gaps, generous padding */
  xl: 24,
  /** 32px – large section separators */
  xxl: 32,
  /** 48px – hero sections, major dividers */
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof Spacing;

/**
 * Border radius tokens for consistent rounding.
 */
export const BorderRadius = {
  /** 4px – subtle rounding (chips, small badges) */
  xs: 4,
  /** 8px – buttons, input fields */
  sm: 8,
  /** 12px – cards, modals */
  md: 12,
  /** 16px – large cards, bottom sheets */
  lg: 16,
  /** 24px – pills, fully rounded elements */
  xl: 24,
  /** 9999px – circles, fully round */
  full: 9999,
} as const;

/**
 * Elevation / shadow presets for layered surfaces.
 * Uses React Native shadow props (iOS) + elevation (Android).
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;
