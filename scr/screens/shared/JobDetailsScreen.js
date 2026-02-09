import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";
import Button from "../../components/Button";

const JobDetailsScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  // Handle passing full job object OR just ID
  const params = route.params || {};
  const initialJob = params.job || {};
  const jobId = initialJob.id || params.jobId;

  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(!initialJob.id);

  // 1. Live Listen to Job Updates
  useEffect(() => {
    if (!jobId) return;

    const unsubscribe = onSnapshot(doc(db, "tasks", jobId), (docSnap) => {
      if (docSnap.exists()) {
        setJob({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert("Error", "This job no longer exists.");
        navigation.goBack();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [jobId]);

  // --- LOGIC: DETERMINE PRICE ---
  const displayPrice = job.agreedPrice ? job.agreedPrice : job.budget;
  const priceLabel = job.agreedPrice ? "Agreed Price" : "Est. Budget";

  const isOwner = user?.uid === job.clientId;
  const isTasker = user?.uid === job.assignedTaskerId;
  const isAssigned = job.status === "Assigned" || job.status === "In Progress";

  // --- ACTIONS ---

  const handleCompleteJob = () => {
    // Instead of completing immediately, Go to Payment Screen
    navigation.navigate("Payment", {
      jobId: job.id,
      amount: displayPrice,
      taskerName: job.assignedTaskerName,
    });
  };

  const handleDeleteJob = async () => {
    Alert.alert("Delete?", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "tasks", jobId));
          navigation.goBack();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="arrow-back" size={24} color={colors.gray800} />
          </TouchableOpacity>
          <CustomText type="h3">Job Details</CustomText>
          {isOwner && job.status === "Open" && (
            <TouchableOpacity onPress={handleDeleteJob}>
              <Icon name="trash-outline" size={22} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        {/* STATUS BANNER */}
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: getStatusColor(job.status) },
          ]}
        >
          <CustomText type="h4" color="white" align="center">
            {job.status.toUpperCase()}
          </CustomText>
        </View>

        {/* MAIN CARD */}
        <View style={styles.content}>
          <CustomText type="h2" style={{ marginBottom: 5 }}>
            {job.title}
          </CustomText>
          <CustomText color="gray500" style={{ marginBottom: 20 }}>
            Posted by {job.clientName}
          </CustomText>

          {/* PRICE CARD */}
          <View style={[styles.priceCard, shadows.small]}>
            <View>
              <CustomText
                type="caption"
                color="gray500"
                style={{ textTransform: "uppercase" }}
              >
                {priceLabel}
              </CustomText>
              <CustomText type="h1" color="primary">
                ₦{displayPrice}
              </CustomText>
            </View>
            <View style={styles.iconCircle}>
              <Icon name="cash" size={28} color={colors.primary} />
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <CustomText type="h4" style={{ marginBottom: 8 }}>
              Description
            </CustomText>
            <CustomText style={{ lineHeight: 24, color: colors.gray700 }}>
              {job.description}
            </CustomText>
          </View>

          {/* LOCATION */}
          <View style={styles.section}>
            <CustomText type="h4" style={{ marginBottom: 8 }}>
              Location
            </CustomText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="location" size={20} color={colors.gray500} />
              <CustomText style={{ marginLeft: 8, color: colors.gray700 }}>
                {job.location || "Remote / No Location"}
              </CustomText>
            </View>
          </View>

          {/* --- CONTEXT AWARE BUTTONS --- */}

          {/* 1. OWNER VIEW */}
          {isOwner && (
            <View style={styles.actionArea}>
              {job.status === "Open" && (
                <Button
                  title={`View Bids (${job.bidsCount || 0})`}
                  onPress={() =>
                    navigation.navigate("ClientBids", { taskId: jobId })
                  }
                  icon="list"
                />
              )}
              {isAssigned && (
                <>
                  <View style={styles.infoBox}>
                    <CustomText>
                      Hired Tasker:{" "}
                      <CustomText type="bold">
                        {job.assignedTaskerName}
                      </CustomText>
                    </CustomText>
                  </View>
                  <Button
                    title="Mark Completed & Pay"
                    onPress={handleCompleteJob}
                    style={{ backgroundColor: "#10B981", marginTop: 10 }}
                  />
                  <Button
                    title="Chat with Tasker"
                    type="outline"
                    onPress={() =>
                      navigation.navigate("Chat", { chatId: jobId })
                    }
                    style={{ marginTop: 10 }}
                  />
                </>
              )}
            </View>
          )}

          {/* 2. TASKER VIEW */}
          {user?.role === "tasker" && !isOwner && (
            <View style={styles.actionArea}>
              {/* Tasker viewing OPEN job */}
              {job.status === "Open" && (
                <Button
                  title="Place a Bid"
                  onPress={() => navigation.navigate("TaskerBid", { job })}
                />
              )}

              {/* Tasker viewing ASSIGNED job */}
              {isTasker && (
                <>
                  <View style={styles.infoBox}>
                    <CustomText type="bold" color="primary">
                      You are hired for this job!
                    </CustomText>
                  </View>
                  <Button
                    title="Chat with Client"
                    type="outline"
                    onPress={() =>
                      navigation.navigate("Chat", { chatId: jobId })
                    }
                    style={{ marginTop: 10 }}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return colors.primary;
    case "Assigned":
      return colors.accent;
    case "In Progress":
      return "#F59E0B";
    case "Completed":
      return "#10B981";
    default:
      return colors.gray500;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  backBtn: { padding: 4 },
  statusBanner: { padding: 8 },
  content: { padding: spacing.lg },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.gray50,
    justifyContent: "center",
    alignItems: "center",
  },
  section: { marginBottom: spacing.xl },
  actionArea: { marginTop: spacing.md },
  infoBox: {
    padding: 15,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
});

export default JobDetailsScreen;
