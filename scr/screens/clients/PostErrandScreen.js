import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext"; // Use the hook!
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { CustomText } from "../../components/CustomText";
import Button from "../../components/Button";
import PaymentModal from "../../components/PaymentModal"; // Import the modal
import { colors, spacing } from "../../components/theme";

const CATEGORIES = [
  "Delivery",
  "Cleaning",
  "Shopping",
  "Repairs",
  "Pet Care",
  "Other",
];

export default function PostErrandScreen({ navigation }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Delivery");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 1. User clicks "Post & Pay"
  const handleInitiatePost = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !budget.trim() ||
      !location.trim()
    ) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    // Open Payment Modal
    setShowPaymentModal(true);
  };

  // 2. Payment Successful -> Save to Database
  const handlePaymentSuccess = async (response) => {
    setLoading(true);
    try {
      // Create the Job in Firestore
      await addDoc(collection(db, "jobs"), {
        clientUid: user.uid,
        clientName: user.displayName || "Client",
        title: title,
        description: description,
        category: category,
        budget: parseFloat(budget),
        location: location,
        status: "open",
        createdAt: new Date().toISOString(),
        isPaid: true,
        paymentReference: response.transactionRef?.reference || "REF_UNKNOWN",
      });

      Alert.alert("Success!", "Your errand has been posted and is live.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "Payment successful, but failed to save job. Contact Support.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <CustomText
            type="bold"
            style={{ fontSize: 24, color: colors.primary }}
          >
            New Errand
          </CustomText>
          <CustomText style={{ color: colors.gray500 }}>
            Fill details & pay to hire a tasker
          </CustomText>
        </View>

        {/* Title */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Errand Title</CustomText>
          <TextInput
            style={styles.input}
            placeholder="e.g. Buy Suya at Yaba"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Chips */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Category</CustomText>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryChip,
                  category === cat && styles.activeChip,
                ]}
              >
                <CustomText
                  style={[
                    styles.chipText,
                    category === cat && styles.activeChipText,
                  ]}
                >
                  {cat}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Description</CustomText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe exactly what you need..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Location</CustomText>
          <TextInput
            style={styles.input}
            placeholder="Area or Address"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Budget */}
        <View style={styles.formGroup}>
          <CustomText style={styles.label}>Your Budget (₦)</CustomText>
          <TextInput
            style={styles.input}
            placeholder="5000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <Button
          title={`Post & Pay ₦${budget || "0"}`}
          onPress={handleInitiatePost}
          loading={loading}
          style={styles.button}
        />

        {/* The Payment Modal */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={parseFloat(budget) || 0}
          email={user?.email || "guest@myerrand.ng"}
          onSuccess={handlePaymentSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  formGroup: { marginBottom: spacing.md },
  label: {
    marginBottom: 6,
    textTransform: "uppercase",
    fontSize: 11,
    color: colors.gray500,
    fontFamily: "Poppins_600SemiBold",
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: colors.gray800,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.gray100,
  },
  activeChip: { backgroundColor: colors.primary },
  chipText: {
    fontSize: 13,
    color: colors.gray600,
    fontFamily: "Poppins_400Regular",
  },
  activeChipText: { color: colors.white, fontFamily: "Poppins_600SemiBold" },
  button: { marginTop: spacing.md },
});
