export const Colors = {
  // Primary - Deep Orange (Kuli Brand)
  primary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#E65100',
    600: '#D84315',
    700: '#BF360C',
    800: '#8B2500',
    900: '#5D1A00',
  },

  // Secondary - Teal
  secondary: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#00796B',
    600: '#00695C',
    700: '#004D40',
  },

  // Accent - Gold
  accent: {
    300: '#FFD54F',
    400: '#FFB300',
    500: '#FF8F00',
  },

  // Semantic Colors
  success: '#2E7D32',
  successLight: '#E8F5E9',
  error: '#C62828',
  errorLight: '#FFEBEE',
  warning: '#F57F17',
  warningLight: '#FFF8E1',

  // Neutral Palette
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#1A1A2E',
  },

  // Dark Theme (Labourer App)
  dark: {
    bg: '#1A1A2E',
    surface: '#2D2D44',
    card: '#2D2D44',
    border: '#3D3D5C',
    nav: '#0F172A',
  },
} as const;

// Convenience aliases
export const Brand = {
  primary: Colors.primary[500],
  secondary: Colors.secondary[500],
  accent: Colors.accent[400],
} as const;

// Light theme (Customer App)
export const LightTheme = {
  background: Colors.neutral[0],
  surface: Colors.neutral[50],
  card: Colors.neutral[0],
  text: Colors.neutral[900],
  textSecondary: Colors.neutral[600],
  textTertiary: Colors.neutral[500],
  border: Colors.neutral[200],
  divider: Colors.neutral[100],
  primary: Colors.primary[500],
  secondary: Colors.secondary[500],
  accent: Colors.accent[400],
  nav: Colors.neutral[0],
  navBorder: Colors.neutral[200],
  statusBar: 'dark' as const,
} as const;

// Dark theme (Labourer App)
export const DarkTheme = {
  background: Colors.dark.bg,
  surface: Colors.dark.surface,
  card: Colors.dark.card,
  text: Colors.neutral[0],
  textSecondary: Colors.neutral[400],
  textTertiary: Colors.neutral[500],
  border: Colors.dark.border,
  divider: Colors.dark.border,
  primary: Colors.primary[400],
  secondary: Colors.secondary[300],
  accent: Colors.accent[300],
  nav: Colors.dark.nav,
  navBorder: Colors.dark.border,
  statusBar: 'light' as const,
} as const;

export type ThemeColors = typeof LightTheme;
