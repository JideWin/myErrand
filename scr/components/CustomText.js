// src/components/CustomText.js - Enhanced version
import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./theme"
const CustomText = ({
  style,
  children,
  type = "body",
  weight = "regular",
  color = "gray800",
  align = "left",
  ...props
}) => {
  const getStyles = () => {
    const baseStyle = {
      color: colors[color] || color,
      textAlign: align,
    };

    switch (type) {
      case "h1":
        return {
          ...baseStyle,
          fontSize: 42,
          lineHeight: 40,
          fontWeight: "bold",
        };
      case "h2":
        return {
          ...baseStyle,
          fontSize: 28,
          lineHeight: 36,
          fontWeight: "bold",
        };
      case "h3":
        return {
          ...baseStyle,
          fontSize: 24,
          lineHeight: 32,
          fontWeight: "600",
        };
      case "h4":
        return {
          ...baseStyle,
          fontSize: 20,
          lineHeight: 28,
          fontWeight: "600",
        };
      case "title":
        return {
          ...baseStyle,
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "600",
        };
      case "body":
        return {
          ...baseStyle,
          fontSize: 16,
          lineHeight: 24,
          fontWeight: "400",
        };
      case "caption":
        return {
          ...baseStyle,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "400",
        };
      case "small":
        return {
          ...baseStyle,
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "400",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Text style={[getStyles(), style]} {...props}>
      {children}
    </Text>
  );
};

export { CustomText, colors };