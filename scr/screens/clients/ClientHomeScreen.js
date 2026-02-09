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
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";

const ClientHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [myErrands, setMyErrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch errands posted by THIS client
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyErrands(tasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const renderErrandItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskCard, shadows.small]}
      onPress={() => navigation.navigate("JobDetails", { job: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon name="cube-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <CustomText type="h4" numberOfLines={1}>
            {item.title}
          </CustomText>
          <CustomText type="caption" color="gray500">
            {item.status}
          </CustomText>
        </View>
        <CustomText type="h4" color="primary">
          ₦{item.budget}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <CustomText type="h2" color="primary">
              Hello, {user?.displayName?.split(" ")[0]}
            </CustomText>
            <CustomText color="gray500">What do you need help with?</CustomText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${user?.displayName}&background=0D9488&color=fff`,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Big CTA Button */}
        <TouchableOpacity
          style={[styles.ctaButton, shadows.medium]}
          onPress={() => navigation.navigate("Post")}
        >
          <View style={styles.ctaContent}>
            <View style={styles.plusIcon}>
              <Icon name="add" size={30} color="white" />
            </View>
            <View>
              <CustomText type="h3" color="white">
                Post a New Errand
              </CustomText>
              <CustomText color="white" style={{ opacity: 0.9 }}>
                Get help quickly
              </CustomText>
            </View>
          </View>
        </TouchableOpacity>

        {/* My Recent Activity */}
        <View style={styles.sectionHeader}>
          <CustomText type="h3">Recent Activity</CustomText>
          <TouchableOpacity onPress={() => navigation.navigate("MyErrands")}>
            <CustomText color="primary">View All</CustomText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <CustomText style={{ padding: 20 }}>
            Loading your errands...
          </CustomText>
        ) : myErrands.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clipboard-outline" size={40} color={colors.gray300} />
            <CustomText color="gray400" style={{ marginTop: 10 }}>
              You haven't posted any errands yet.
            </CustomText>
          </View>
        ) : (
          <FlatList
            data={myErrands.slice(0, 3)} // Show only top 3
            renderItem={renderErrandItem}
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

  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  ctaContent: { flexDirection: "row", alignItems: "center" },
  plusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  taskCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: { alignItems: "center", padding: 40 },
});

export default ClientHomeScreen;
