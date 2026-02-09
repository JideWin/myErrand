import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";

const ClientBidsScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const taskId = params.taskId || params.job?.id;

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) {
      console.error("No Task ID found!", params);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "bids"),
      where("taskId", "==", taskId),
      orderBy("amount", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bidsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBids(bidsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [taskId]);

  const handleAcceptBid = (bid) => {
    Alert.alert("Accept Bid?", `Hire ${bid.taskerName} for ₦${bid.amount}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Hire Now",
        onPress: async () => {
          try {
            // 1. Update Job Status
            const jobRef = doc(db, "tasks", taskId);
            await updateDoc(jobRef, {
              status: "Assigned",
              assignedTaskerId: bid.taskerId,
              assignedTaskerName: bid.taskerName,
              agreedPrice: bid.amount,
            });

            // 2. Update Bid Status
            const bidRef = doc(db, "bids", bid.id);
            await updateDoc(bidRef, { status: "Accepted" });

            // 3. SEND NOTIFICATION TO TASKER
            // This alerts the tasker they have been hired
            if (bid.taskerId) {
              await addDoc(collection(db, "notifications"), {
                userId: bid.taskerId, // The Tasker's ID
                title: "Congratulations! You're Hired!",
                body: `Your bid of ₦${bid.amount} was accepted. Check "My Jobs" to start working.`,
                type: "JOB_ASSIGNED",
                relatedId: taskId,
                read: false,
                createdAt: serverTimestamp(),
              });
            }

            Alert.alert("Success", "Tasker hired! They have been notified.", [
              { text: "OK", onPress: () => navigation.navigate("ClientMain") },
            ]);
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const renderBid = ({ item }) => (
    <View style={[styles.bidCard, shadows.small]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <CustomText type="h3" color="white">
            {item.taskerName?.charAt(0) || "T"}
          </CustomText>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <CustomText type="h3">
            {item.taskerName || "Unknown Tasker"}
          </CustomText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="star" size={14} color="#FBBF24" />
            <CustomText
              type="caption"
              color="gray500"
              style={{ marginLeft: 4 }}
            >
              5.0 Rating
            </CustomText>
          </View>
        </View>
        <CustomText type="h2" color="primary">
          ₦{item.amount}
        </CustomText>
      </View>

      <View style={styles.proposalBox}>
        <CustomText color="gray700" style={{ fontStyle: "italic" }}>
          "{item.proposal || "No proposal text"}"
        </CustomText>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptBid(item)}
      >
        <CustomText type="bold" color="white">
          ACCEPT BID
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 5 }}
        >
          <Icon name="arrow-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <CustomText type="h3" style={{ marginLeft: 15 }}>
          {bids.length} Bid{bids.length !== 1 ? "s" : ""} Received
        </CustomText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bids.length === 0 ? (
        <View style={styles.center}>
          <Icon name="documents-outline" size={50} color={colors.gray300} />
          <CustomText type="h4" color="gray400" style={{ marginTop: 10 }}>
            No bids found.
          </CustomText>
          <CustomText type="caption" color="gray400">
            (Task ID: {taskId ? taskId.slice(0, 6) : "Missing"}...)
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={bids}
          renderItem={renderBid}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  bidCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  proposalBox: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
});

export default ClientBidsScreen;
