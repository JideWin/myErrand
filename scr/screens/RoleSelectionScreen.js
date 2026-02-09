import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../components/CustomText";
import { colors, spacing } from "../components/theme";
import Icon from "../components/Icon";

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomText
          type="h1"
          align="center"
          color="primary"
          style={styles.title}
        >
          How do you want to use MyErrand?
        </CustomText>

        {/* OPTION 1: CLIENT */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Signup", { role: "client" })}
        >
          <View
            style={[styles.iconBox, { backgroundColor: colors.primary + "20" }]}
          >
            <Icon name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <CustomText type="h3" color="primary">
              I need help
            </CustomText>
            <CustomText color="gray500">
              I want to post errands and hire workers.
            </CustomText>
          </View>
          <Icon name="chevron-forward" size={24} color={colors.gray400} />
        </TouchableOpacity>

        {/* OPTION 2: TASKER */}
        <TouchableOpacity
          style={[styles.card, styles.taskerCard]}
          onPress={() => navigation.navigate("Signup", { role: "tasker" })}
        >
          <View
            style={[styles.iconBox, { backgroundColor: colors.accent + "20" }]}
          >
            <Icon name="briefcase" size={32} color={colors.accent} />
          </View>
          <View style={styles.textContainer}>
            <CustomText type="h3" color="accent">
              I want to work
            </CustomText>
            <CustomText color="gray500">
              I want to earn money by completing tasks.
            </CustomText>
          </View>
          <Icon name="chevron-forward" size={24} color={colors.gray400} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 20 }}
        >
          <CustomText align="center" color="gray500">
            Already have an account?{" "}
            <CustomText type="bold" color="primary">
              Login
            </CustomText>
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, padding: spacing.lg, justifyContent: "center" },
  title: { marginBottom: spacing.xl },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    marginBottom: spacing.md,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  taskerCard: {
    borderColor: colors.accent,
    borderWidth: 1.5,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  textContainer: { flex: 1 },
});

export default RoleSelectionScreen;
