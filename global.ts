import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  primary: '#3B82F6',
  primaryFaded: 'rgba(59, 130, 246, 0.3)',
  background: '#F3F4F6',
  border: '#E5E7EB',
  white: '#FFFFFF',
  textMain: '#333333',
  textMuted: '#9CA3AF',

  error: '#EF4444',
  success: '#10B981',
  overlay: 'rgba(0,0,0,0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const globalStyles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
