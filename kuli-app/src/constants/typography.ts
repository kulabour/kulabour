import { TextStyle, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// ─── Customer App Typography (Standard sizes) ─────────────────────────────────
export const CustomerTypography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  displayMd: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headingLg: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headingMd: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  headingSm: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  labelLg: {
    fontFamily,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelMd: {
    fontFamily,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
};

// ─── Labourer App Typography (Larger sizes, minimum 16px) ──────────────────────
// All text is minimum 16px for readability on-site / outdoors
export const LabourerTypography: Record<string, TextStyle> = {
  displayLg: {
    fontFamily,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  displayMd: {
    fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headingLg: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headingMd: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  headingSm: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySm: {
    fontFamily,
    fontSize: 16,        // Enforced minimum 16px
    lineHeight: 22,
    fontWeight: '400',
  },
  labelLg: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelMd: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontFamily,
    fontSize: 16,        // Enforced minimum 16px
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
};

export type TypographyVariant = keyof typeof CustomerTypography;
