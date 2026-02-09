import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";

const TaskerHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs assigned to THIS tasker
  useEffect(() => {
    if (!user) return;

    // Query for jobs where 'assignedTaskerId' matches this user
    const q = query(
      collection(db, "tasks"),
      where("assignedTaskerId", "==", user.uid),
      where("status", "in", ["Assigned", "In Progress"]),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setActiveJobs(tasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const renderActiveJob = ({ item }) => (
    <TouchableOpacity
      style={[styles.jobCard, shadows.small]}
      onPress={() => navigation.navigate("JobDetails", { job: item })}
    >
      <View style={styles.cardRow}>
        <View style={styles.badge}>
          <CustomText
            type="caption"
            color="white"
            style={{ fontWeight: "bold" }}
          >
            ACTIVE
          </CustomText>
        </View>
        <CustomText type="h3" color="primary">
          ₦{item.budget}
        </CustomText>
      </View>
      <CustomText type="h3" style={{ marginTop: 5 }}>
        {item.title}
      </CustomText>
      <CustomText color="gray500" numberOfLines={2} style={{ marginTop: 5 }}>
        {item.description}
      </CustomText>

      <View style={styles.divider} />

      <View style={styles.cardRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="person-circle-outline" size={16} color={colors.gray500} />
          <CustomText type="caption" style={{ marginLeft: 5 }}>
            {item.clientName || "Client"}
          </CustomText>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <CustomText
            type="caption"
            color="primary"
            style={{ fontWeight: "bold" }}
          >
            Update Status
          </CustomText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* --- HEADER (Worker Dashboard) --- */}
        <View style={styles.header}>
          <View>
            <CustomText type="h2" color="accent">
              Worker Dashboard
            </CustomText>
            <CustomText color="gray500">
              Welcome back, {user?.displayName?.split(" ")[0]}
            </CustomText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${user?.displayName}&background=6366f1&color=fff`,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* --- EARNINGS CARD --- */}
        <View style={[styles.statsCard, shadows.medium]}>
          <View style={styles.statCol}>
            <CustomText type="caption" color="white">
              Total Earnings
            </CustomText>
            <CustomText type="h1" color="white">
              ₦0.00
            </CustomText>
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.statCol}>
            <CustomText type="caption" color="white">
              Jobs Done
            </CustomText>
            <CustomText type="h1" color="white">
              0
            </CustomText>
          </View>
        </View>

        {/* --- FIND WORK BUTTON --- */}
        <TouchableOpacity
          style={styles.findWorkBtn}
          onPress={() => navigation.navigate("Available")}
        >
          <Icon name="search" size={20} color={colors.primary} />
          <CustomText type="bold" color="primary" style={{ marginLeft: 10 }}>
            Browse Open Jobs
          </CustomText>
        </TouchableOpacity>

        {/* --- ACTIVE JOBS LIST --- */}
        <View style={styles.sectionHeader}>
          <CustomText type="h3">My Active Jobs</CustomText>
        </View>

        {loading ? (
          <CustomText style={{ padding: 20 }}>Loading jobs...</CustomText>
        ) : activeJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="briefcase-outline" size={50} color={colors.gray300} />
            <CustomText type="h4" color="gray400" style={{ marginTop: 10 }}>
              No active jobs
            </CustomText>
            <CustomText type="caption" color="gray400">
              Go to "Available" to find work!
            </CustomText>
          </View>
        ) : (
          <FlatList
            data={activeJobs}
            renderItem={renderActiveJob}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50, padding: spacing.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },

  statsCard: {
    backgroundColor: "#4f46e5", // Indigo color for Tasker
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statCol: { alignItems: "center" },
  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  findWorkBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.xl,
    borderStyle: "dashed",
  },

  sectionHeader: { marginBottom: spacing.md },

  jobCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  divider: { height: 1, backgroundColor: colors.gray100, marginVertical: 10 },
  actionBtn: { backgroundColor: colors.gray50, padding: 6, borderRadius: 6 },

  emptyState: { alignItems: "center", padding: 40 },
});

export default TaskerHomeScreen;
