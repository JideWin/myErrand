import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
// FIXED: Modern Safe Area Import
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Card from "../../components/Card";

const TaskerHomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  // Placeholder data - ideally verify this with real data later
  const stats = {
    earnings: 0,
    completed: 0,
    rating: 5.0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <CustomText type="h2">
            Hello, {user?.displayName || "Tasker"}
          </CustomText>
          <CustomText color="gray500">Ready to work today?</CustomText>
        </View>

        {/* Dashboard Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <CustomText type="h2" color="primary">
              ₦{stats.earnings}
            </CustomText>
            <CustomText type="caption">Earnings</CustomText>
          </View>
          <View style={styles.statCard}>
            <CustomText type="h2" color="accent">
              {stats.completed}
            </CustomText>
            <CustomText type="caption">Tasks Done</CustomText>
          </View>
          <View style={styles.statCard}>
            <CustomText type="h2" color="secondary">
              {stats.rating}★
            </CustomText>
            <CustomText type="caption">Rating</CustomText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <CustomText type="title">Actions</CustomText>
        </View>

        <Card
          title="Find New Jobs"
          subtitle="Browse available errands near you"
          price="Open"
          status="Active"
          onPress={() => navigation.navigate("AvailableJobs")}
        />

        <Card
          title="My Jobs"
          subtitle="View your active and completed tasks"
          price="View"
          status="In Progress"
          onPress={() => navigation.navigate("MyJobs")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scroll: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    width: "30%",
    ...shadows.light,
  },
  sectionHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});

export default TaskerHomeScreen;
