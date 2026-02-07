import React from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "./theme";

export const CustomText = ({
  children,
  style,
  type = "body",
  color = "black",
}) => {
  return (
    <Text style={[styles[type], { color: colors[color] || color }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    fontWeight: "bold",
  },
  h2: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  caption: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: colors.gray500,
  },
});
