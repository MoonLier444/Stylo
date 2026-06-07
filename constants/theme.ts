export const Colors = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  offWhite: '#F8F7F5',
  surface: '#F2F1EE',
  surfaceElevated: '#ECECEA',

  gray100: '#F5F5F3',
  gray200: '#E8E8E5',
  gray300: '#D4D4D0',
  gray400: '#ABABAB',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#3A3A3A',
  gray800: '#262626',
  gray900: '#171717',

  accent: '#1A1A1A',
  accentMuted: '#3D3D3D',

  safe: '#2D5016',
  recommended: '#1A3A5C',
  exploration: '#4A1A5C',

  safeLight: '#E8F0E0',
  recommendedLight: '#E0EAF5',
  explorationLight: '#F0E0F5',

  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',

  transparent: 'transparent',
} as const

export const Typography = {
  fontFamily: {
    sans: undefined,
    mono: undefined,
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
} as const

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const

export const Shadow = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  },
} as const
