import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "./CustomText"; // Ensure this path matches your project
import { colors } from "./theme"; // Ensure this path matches your project

// ✅ YOUR PAYSTACK TEST KEY
const PAYSTACK_PUBLIC_KEY = "pk_test_bffa0c790c3fe5f02e846a9bf39e28e3b95207bd";

export default function PaymentModal({
  visible,
  onClose,
  amount,
  email,
  onSuccess,
}) {
  // Format amount for display (e.g. ₦5,000)
  const displayAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <CustomText type="bold" style={styles.title}>
              Secure Payment
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Payment Summary */}
          <View style={styles.infoContainer}>
            <CustomText style={styles.label}>Total to Pay:</CustomText>
            <CustomText type="bold" style={styles.amount}>
              {displayAmount}
            </CustomText>
            <View style={styles.secureBadge}>
              <Ionicons name="lock-closed" size={12} color="#008080" />
              <CustomText style={styles.secureText}>
                {" "}
                Secured by Paystack
              </CustomText>
            </View>
          </View>

          {/* Paystack Component (Hidden until active) */}
          <View style={{ flex: 1 }}>
            <Paystack
              paystackKey={PAYSTACK_PUBLIC_KEY}
              amount={amount}
              billingEmail={email}
              currency="NGN"
              activityIndicatorColor={colors.primary}
              onCancel={(e) => {
                Alert.alert(
                  "Payment Cancelled",
                  "You cancelled the transaction.",
                );
              }}
              onSuccess={(res) => {
                // Return the full response so we can verify the reference ID in backend
                onSuccess(res);
                onClose();
              }}
              autoStart={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Slide up from bottom
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%", // Takes up most of the screen
    padding: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: colors.primary,
  },
  closeBtn: {
    padding: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    color: "#333",
    marginBottom: 10,
  },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureText: {
    fontSize: 12,
    color: "#008080",
    fontWeight: "600",
  },
});
