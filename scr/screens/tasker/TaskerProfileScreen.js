import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";

const TaskerProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, isDestructive = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}
      >
        <Icon
          name={icon}
          size={22}
          color={isDestructive ? colors.error : colors.accent}
        />
      </View>
      <View style={styles.menuContent}>
        <CustomText
          style={[styles.menuText, isDestructive && styles.destructiveText]}
        >
          {label}
        </CustomText>
      </View>
      <Icon name="chevron-forward" size={20} color={colors.gray400} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={[styles.avatarContainer, shadows.medium]}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${user?.displayName || "Tasker"}&background=4f46e5&color=fff&size=128&bold=true`,
              }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <Icon name="pencil" size={12} color="white" />
            </View>
          </View>

          <CustomText type="h2" style={styles.name}>
            {user?.displayName || "Tasker Name"}
          </CustomText>
          <View style={styles.verifiedBadge}>
            <Icon name="checkmark-circle" size={16} color={colors.white} />
            <CustomText
              type="caption"
              color="white"
              style={{ marginLeft: 4, fontWeight: "700" }}
            >
              VERIFIED WORKER
            </CustomText>
          </View>
        </View>

        {/* --- EARNINGS DASHBOARD --- */}
        <View style={[styles.statsContainer, shadows.light]}>
          <View style={styles.statItem}>
            <CustomText type="h2" color="accent">
              ₦0
            </CustomText>
            <CustomText type="caption" color="gray500">
              Wallet
            </CustomText>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <CustomText type="h2" color="primary">
              0
            </CustomText>
            <CustomText type="caption" color="gray500">
              Jobs Done
            </CustomText>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText type="h2" color="warning">
                5.0
              </CustomText>
              <Icon
                name="star"
                size={16}
                color="#fbbf24"
                style={{ marginLeft: 2 }}
              />
            </View>
            <CustomText type="caption" color="gray500">
              Rating
            </CustomText>
          </View>
        </View>

        {/* --- MENU SECTIONS --- */}
        <View style={styles.section}>
          <CustomText type="caption" style={styles.sectionTitle}>
            WORK PREFERENCES
          </CustomText>
          <MenuItem
            icon="hammer-outline"
            label="My Skills & Services"
            onPress={() => {}}
          />
          <MenuItem
            icon="map-outline"
            label="Service Area"
            onPress={() => {}}
          />
          <MenuItem
            icon="calendar-outline"
            label="Availability"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <CustomText type="caption" style={styles.sectionTitle}>
            FINANCE
          </CustomText>
          <MenuItem
            icon="wallet-outline"
            label="Bank Details"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <MenuItem
            icon="document-text-outline"
            label="Transaction History"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <CustomText type="caption" style={styles.sectionTitle}>
            ACCOUNT
          </CustomText>
          <MenuItem
            icon="settings-outline"
            label="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />
        </View>

        {/* --- LOGOUT --- */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <MenuItem
            icon="log-out-outline"
            label="Log Out"
            onPress={handleLogout}
            isDestructive={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { paddingBottom: spacing.xl },

  header: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.light,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: { marginBottom: 8 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: -25, // Overlap the header
    borderRadius: 16,
    padding: spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: { alignItems: "center", flex: 1 },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.gray200,
  },

  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    color: colors.gray500,
    fontWeight: "600",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  destructiveIconBox: {
    backgroundColor: "#FEE2E2", // Light red
  },
  menuContent: { flex: 1 },
  menuText: {
    fontSize: 16,
    color: colors.gray800,
    fontFamily: "Poppins-Medium",
  },
  destructiveText: {
    color: colors.error,
  },
});

export default TaskerProfileScreen;
