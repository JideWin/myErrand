import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { colors, spacing, shadows } from "../../components/theme";
import { CustomText } from "../../components/CustomText";
import Icon from "../../components/Icon";
import { doc, onSnapshot } from "firebase/firestore"; // Import Firestore Listener
import { db } from "../../config/firebase";

const TaskerProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(user || {});

  // --- LIVE LISTENER FOR STATS ---
  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfileData({ ...user, ...docSnap.data() }); // Merge live data
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, destructive }) => (
    <TouchableOpacity
      style={[styles.menuItem, destructive && styles.destructiveItem]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View
          style={[
            styles.iconBox,
            destructive && { backgroundColor: "#FEE2E2" },
          ]}
        >
          <Icon
            name={icon}
            size={20}
            color={destructive ? colors.error : colors.primary}
          />
        </View>
        <CustomText
          style={[styles.menuText, destructive && { color: colors.error }]}
        >
          {label}
        </CustomText>
      </View>
      <Icon
        name="chevron-forward"
        size={20}
        color={destructive ? colors.error : colors.gray400}
      />
    </TouchableOpacity>
  );

  const StatBox = ({ label, value, icon, isMoney }) => (
    <View style={styles.statBox}>
      <Icon
        name={icon}
        size={24}
        color={colors.primary}
        style={{ marginBottom: 5 }}
      />
      <CustomText type="h2" color="primary">
        {isMoney ? `₦${(value || 0).toLocaleString()}` : value || 0}
      </CustomText>
      <CustomText type="caption" color="gray500">
        {label}
      </CustomText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View>
              <CustomText type="h2" style={{ marginBottom: 4 }}>
                {profileData.fullName || "Tasker Name"}
              </CustomText>
              <View style={styles.badge}>
                <Icon name="checkmark-circle" size={14} color="white" />
                <CustomText
                  type="caption"
                  color="white"
                  style={{ marginLeft: 4, fontWeight: "bold" }}
                >
                  VERIFIED WORKER
                </CustomText>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                style={styles.avatar}
              />
              <View style={styles.editBadge}>
                <Icon name="pencil" size={12} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Dashboard */}
        <View style={[styles.statsContainer, shadows.medium]}>
          <StatBox
            label="Wallet Balance"
            value={profileData.walletBalance}
            icon="wallet"
            isMoney
          />
          <View style={styles.divider} />
          <StatBox
            label="Jobs Done"
            value={profileData.jobsCompleted} // <--- READS FROM FIREBASE NOW
            icon="briefcase"
          />
          <View style={styles.divider} />
          <StatBox
            label="Total Earnings"
            value={profileData.totalEarnings} // <--- READS FROM FIREBASE NOW
            icon="cash"
            isMoney
          />
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <CustomText type="h4" style={styles.sectionTitle}>
            Work Preferences
          </CustomText>
          <MenuItem
            icon="construct"
            label="My Skills & Services"
            onPress={() => navigation.navigate("Services")}
          />
          <MenuItem icon="map" label="Service Area" onPress={() => {}} />
          <MenuItem icon="calendar" label="Availability" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <CustomText type="h4" style={styles.sectionTitle}>
            Finance
          </CustomText>
          <MenuItem
            icon="card"
            label="Withdraw Funds"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <MenuItem
            icon="time"
            label="Transaction History"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <CustomText type="h4" style={styles.sectionTitle}>
            Account
          </CustomText>
          <MenuItem
            icon="settings"
            label="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
          />
          <MenuItem
            icon="log-out"
            label="Log Out"
            destructive
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { paddingBottom: 40 },
  header: {
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...shadows.small,
  },
  profileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.gray100,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginTop: -20,
    borderRadius: 16,
    padding: spacing.md,
  },
  statBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  divider: {
    width: 1,
    backgroundColor: colors.gray200,
    height: "80%",
    alignSelf: "center",
  },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    color: colors.gray600,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  destructiveItem: { borderColor: "#FECACA", backgroundColor: "#FEF2F2" },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: colors.gray800,
  },
});

export default TaskerProfileScreen;
