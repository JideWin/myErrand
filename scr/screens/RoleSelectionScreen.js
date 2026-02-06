// src/screens/RoleSelectionScreen.js
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "../components/CustomText";
// Ensure this path matches your structure (we fixed this in LoginScreen earlier)
import { colors } from "../components/theme";
import { globalStyles } from "../styles/GlobalStyles";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore"; // Changed to setDoc for robustness
import { db } from "../config/firebase";

const RoleSelectionScreen = ({ navigation }) => {
  const { user, signOut } = useAuth(); // Get signOut to allow clearing session
  const [selectedRole, setSelectedRole] = useState(null); // 'client' or 'tasker'
  const [loading, setLoading] = useState(false);

  // Helper to clear session for testing
  const handleLogout = async () => {
    try {
      await signOut();
      // Navigation is usually handled by AuthContext state change,
      // but explicit reset helps ensure we go back to start
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const handleContinue = async () => {
    // 1. Validation
    if (!selectedRole) {
      Alert.alert("Selection Required", "Please select a role to continue.");
      return;
    }

    setLoading(true);

    try {
      // 2. Update Role in Firestore if user is logged in
      if (user) {
        const userRef = doc(db, "users", user.uid);

        // Use setDoc with merge: true.
        // This guarantees the document exists even if signup didn't create it perfectly.
        await setDoc(
          userRef,
          {
            role: selectedRole,
            roleSelectedAt: new Date().toISOString(),
            profileCompleted: true,

            // Initialize Client-specific fields
            ...(selectedRole === "client" && {
              totalTasksPosted: 0,
              spending: 0,
            }),

            // Initialize Tasker-specific fields
            ...(selectedRole === "tasker" && {
              tasksCompleted: 0,
              rating: 0,
              earnings: 0,
              isOnline: true,
            }),
          },
          { merge: true }
        );
      }

      setLoading(false);

      // 3. Navigation Logic
      if (selectedRole === "client") {
        navigation.reset({
          index: 0,
          routes: [{ name: "ClientMain" }],
        });
      } else if (selectedRole === "tasker") {
        navigation.reset({
          index: 0,
          routes: [{ name: "TaskerMain" }],
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating role:", error);
      Alert.alert(
        "Connection Error",
        "Could not save your selection. Please check your internet and try again."
      );
    }
  };

  // Reusable Card Component for consistency
  const RoleCard = ({
    role,
    title,
    description,
    icon,
    isSelected,
    onSelect,
  }) => (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          isSelected
            ? { backgroundColor: colors.primary }
            : { backgroundColor: "#F3F4F6" },
        ]}
      >
        <Ionicons
          name={icon}
          size={32}
          color={isSelected ? "#FFFFFF" : colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <CustomText type="h4" style={styles.cardTitle}>
          {title}
        </CustomText>
        <CustomText type="body" style={styles.cardDescription}>
          {description}
        </CustomText>
      </View>
      <View style={styles.radioContainer}>
        <View
          style={[
            styles.radioOuter,
            isSelected && { borderColor: colors.primary },
          ]}
        >
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.content}>
        {/* Header with Logout option */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <CustomText type="h2" style={styles.title}>
                Who are you?
              </CustomText>
              <CustomText type="body" style={styles.subtitle}>
                Choose how you want to use myErrand
              </CustomText>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
              <CustomText style={{ color: colors.error, fontSize: 12 }}>
                Sign Out
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <RoleCard
            role="client"
            title="Requester (Client)"
            description="I want to post errands and hire people to help me."
            icon="person"
            isSelected={selectedRole === "client"}
            onSelect={() => setSelectedRole("client")}
          />

          <RoleCard
            role="tasker"
            title="Tasker (Worker)"
            description="I want to earn money by completing errands."
            icon="briefcase"
            isSelected={selectedRole === "tasker"}
            onSelect={() => setSelectedRole("tasker")}
          />
        </View>

        <TouchableOpacity
          style={[globalStyles.button, !selectedRole && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedRole || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <CustomText style={globalStyles.buttonText}>Continue</CustomText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  logoutButton: {
    alignItems: "center",
    padding: 8,
  },
  title: {
    marginBottom: 8,
    textAlign: "left",
    color: colors.gray900,
  },
  subtitle: {
    color: colors.gray500,
    textAlign: "left",
  },
  cardsContainer: {
    marginBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: "#F0FDFA", // Light teal background
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    marginBottom: 4,
    color: "#1F2937",
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  radioContainer: {
    justifyContent: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#9CA3AF",
  },
});

export default RoleSelectionScreen;
