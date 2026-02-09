import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing } from "../../components/theme";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const TaskerBidScreen = ({ navigation, route }) => {
  const { job } = route.params || {};
  const { user } = useAuth();

  // Default bid to the job budget
  const [bidAmount, setBidAmount] = useState(
    job?.budget ? String(job.budget) : "",
  );
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceBid = async () => {
    if (!bidAmount || !proposal) {
      Alert.alert(
        "Missing Info",
        "Please enter your price and a short proposal.",
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Create the Bid
      await addDoc(collection(db, "bids"), {
        taskId: job.id,
        taskerId: user.uid,
        taskerName: user.displayName || "Tasker",
        amount: parseFloat(bidAmount),
        proposal: proposal,
        status: "Pending",
        createdAt: serverTimestamp(),
        clientEmail: job.clientEmail || "",
      });

      // 2. Update the Job (Increment bid count)
      const jobRef = doc(db, "tasks", job.id);
      await updateDoc(jobRef, {
        bidsCount: increment(1),
      });

      // 3. SEND NOTIFICATION TO CLIENT
      // This alerts the client that someone wants the job
      if (job.clientId) {
        await addDoc(collection(db, "notifications"), {
          userId: job.clientId, // The Client's ID
          title: "New Bid Received!",
          body: `${user.displayName || "A Tasker"} placed a bid of ₦${bidAmount} on "${job.title}"`,
          type: "BID_RECEIVED",
          relatedId: job.id,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      Alert.alert("Success", "Bid placed successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("TaskerMain", { screen: "Jobs" }),
        },
      ]);
    } catch (error) {
      console.error("Bid Error:", error);
      Alert.alert("Error", "Could not place bid. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <CustomText type="h2" color="primary">
              Place a Bid
            </CustomText>
            <CustomText color="gray500">For: {job?.title}</CustomText>
          </View>

          <View style={styles.infoCard}>
            <Icon name="cash-outline" size={24} color={colors.primary} />
            <View style={{ marginLeft: 15 }}>
              <CustomText type="caption" color="gray500">
                CLIENT'S BUDGET
              </CustomText>
              <CustomText type="h3">₦{job?.budget}</CustomText>
            </View>
          </View>

          <View style={styles.form}>
            <CustomText style={styles.label}>Your Price (₦)</CustomText>
            <TextInput
              style={styles.input}
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              placeholder="e.g. 5000"
            />

            <CustomText style={styles.label}>
              Why should they hire you?
            </CustomText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={proposal}
              onChangeText={setProposal}
              multiline
              numberOfLines={4}
              placeholder="I have 5 years experience and can start immediately..."
              textAlignVertical="top"
            />
          </View>

          <Button
            title="Submit Bid"
            onPress={handlePlaceBid}
            loading={loading}
            style={{ marginTop: spacing.xl }}
          />

          <Button
            title="Cancel"
            type="outline"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.md, borderColor: colors.gray300 }}
            textStyle={{ color: colors.gray500 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.lg },
  header: { marginBottom: spacing.xl },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  form: { gap: spacing.md },
  label: { fontWeight: "600", color: colors.gray700, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  textArea: { height: 100 },
});

export default TaskerBidScreen;
