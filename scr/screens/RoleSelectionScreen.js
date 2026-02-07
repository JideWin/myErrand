import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
// FIXED: Modern Safe Area Import
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../components/CustomText";
import { colors, spacing, shadows } from "../components/theme";

const RoleSelectionScreen = ({ navigation }) => {
  const selectRole = (role) => {
    navigation.navigate("Signup", { role });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="h1" align="center">Choose Your Role</CustomText>
        <CustomText align="center" color="gray500" style={styles.subtitle}>
          How do you want to use MyErrand?
        </CustomText>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => selectRole("client")}
          activeOpacity={0.8}
        >
          <CustomText type="h2" color="primary">I need help</CustomText>
          <CustomText align="center" style={styles.cardDesc}>
            Hire runners to run errands, deliver packages, or help with tasks.
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => selectRole("tasker")}
          activeOpacity={0.8}
        >
          <CustomText type="h2" color="accent">I want to work</CustomText>
          <CustomText align="center" style={styles.cardDesc}>
            Earn money by completing errands and tasks for others.
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  cardContainer: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.gray50,
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.light,
    marginBottom: 20,
  },
  cardDesc: {
    marginTop: spacing.sm,
    color: colors.gray500,
  },
});

export default RoleSelectionScreen;