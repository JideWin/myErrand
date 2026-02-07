// src/components/Card.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
// FIXED: Import from theme instead of CustomText
import { colors, spacing, shadows } from "./theme";
import { CustomText } from "./CustomText";

const Card = ({ title, subtitle, price, status, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, shadows.light]} onPress={onPress}>
      <View style={styles.row}>
        <CustomText type="title">{title}</CustomText>
        <CustomText color="primary">₦{price}</CustomText>
      </View>
      <CustomText color="gray500">{subtitle}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
});

export default Card;
