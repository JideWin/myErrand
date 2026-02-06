// src/components/Button.js
import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { CustomText } from './CustomText';
import { colors } from './CustomText';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const getButtonStyles = () => {
    const base = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    const variants = {
      primary: {
        backgroundColor: disabled ? colors.gray300 : colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: disabled ? colors.gray300 : colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    const sizes = {
      small: { paddingVertical: 8, paddingHorizontal: 16 },
      medium: { paddingVertical: 12, paddingHorizontal: 24 },
      large: { paddingVertical: 16, paddingHorizontal: 32 },
    };

    return { ...base, ...variants[variant], ...sizes[size] };
  };

  const getTextStyles = () => {
    const variants = {
      primary: { color: colors.white },
      secondary: { color: disabled ? colors.gray300 : colors.primary },
      ghost: { color: disabled ? colors.gray300 : colors.primary },
    };

    return variants[variant];
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextStyles().color} />
      ) : (
        <CustomText
          weight="600"
          style={[getTextStyles(), textStyle]}
        >
          {children}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default Button;