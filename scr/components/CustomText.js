// scr/components/CustomText.js
import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./theme"; // Importing correctly

export const CustomText = ({
  children,
  style,
  type = "body",
  color = "gray800",
  align = "left",
  ...props
}) => {
  // Safe color lookup: if 'color' is a key in theme, use it; otherwise use the string directly
  const textColor = colors[color] ? colors[color] : color;

  return (
    <Text
      style={[styles[type], { color: textColor, textAlign: align }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  h2: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
  },
  h3: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  body: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: colors.gray500,
  },
  bold: {
    fontSize: 14,
    fontFamily: "Poppins-Bold",
  },
});
