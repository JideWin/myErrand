// src/components/Card.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "./theme";
import { CustomText } from "./CustomText";

const Card = ({ title, subtitle, price, status, onPress }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "pending":
        return colors.accent;
      case "paid":
        return colors.success;
      case "accepted":
        return colors.primary;
      default:
        return colors.gray500;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, shadows.light]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.row}>
          <CustomText type="title" style={{ flex: 1 }}>
            {title}
          </CustomText>
          <CustomText type="title" color="primary">
            {price ? `₦${price}` : "Open"}
          </CustomText>
        </View>

        <CustomText type="caption" color="gray500" style={styles.subtitle}>
          {subtitle}
        </CustomText>

        {status && (
          <View
            style={[styles.badge, { backgroundColor: getStatusColor() + "15" }]}
          >
            <CustomText
              type="caption"
              style={{ color: getStatusColor(), textTransform: "uppercase" }}
            >
              {status}
            </CustomText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  content: {
    padding: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});

export default Card;
