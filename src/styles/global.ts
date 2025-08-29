export const Colors = {
  // Primary colors
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  
  // Success colors
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#059669',
  
  // Error colors
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  
  // Neutral colors
  white: '#ffffff',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  
  // Background colors
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceHover: '#f1f5f9',
  
  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Typography = {
  h1: {
    fontSize: 42,
    fontWeight: 'bold' as const,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body1: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  body2: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
};
