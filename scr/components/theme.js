// scr/components/theme.js

// Named export for colors
export const colors = {
  primary: "#008080", // Teal
  primaryDark: "#006666",
  primaryLight: "#E0F2F2",
  secondary: "#1F2937", // Navy
  accent: "#F59E0B", // Amber
  success: "#10B981",
  error: "#EF4444",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray500: "#6B7280",
  gray800: "#1F2937",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
};
