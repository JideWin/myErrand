import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
// FIXED: Modern Safe Area Import
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing } from "../../components/theme";
import Button from "../../components/Button";

const SettingsScreen = ({ navigation }) => {
  const { signOut, user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="h1">Settings</CustomText>
      </View>

      <View style={styles.section}>
        <CustomText type="title" style={styles.sectionTitle}>
          Account
        </CustomText>
        <View style={styles.row}>
          <CustomText>Email</CustomText>
          <CustomText color="gray500">{user?.email}</CustomText>
        </View>
        <View style={styles.row}>
          <CustomText>Role</CustomText>
          <CustomText color="gray500" style={{ textTransform: "capitalize" }}>
            {user?.role || "User"}
          </CustomText>
        </View>
      </View>

      <View style={styles.section}>
        <CustomText type="title" style={styles.sectionTitle}>
          App
        </CustomText>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("PaymentMethods")}
        >
          <CustomText>Payment Methods</CustomText>
          <CustomText color="primary">Manage</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate("LanguageSelection")}
        >
          <CustomText>Language</CustomText>
          <CustomText color="primary">English</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          style={{ backgroundColor: colors.error }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray50,
  },
  footer: {
    padding: spacing.lg,
    marginTop: "auto",
  },
});

export default SettingsScreen;
