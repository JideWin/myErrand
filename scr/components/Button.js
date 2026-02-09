// scr/components/Button.js
import React from "react";
import { TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { CustomText } from "./CustomText";
// FIXED: Import colors from theme, NOT from CustomText
import { colors, spacing } from "./theme";

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <CustomText type="h3" style={[styles.text, textStyle]}>
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginVertical: 10,
  },
  disabled: {
    backgroundColor: colors.gray200,
  },
  text: {
    color: colors.white,
    fontWeight: "bold",
  },
});

export default Button;
