import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Paystack } from "react-native-paystack-webview";
import { Ionicons } from "@expo/vector-icons";
import { CustomText } from "./CustomText";
import { colors } from "./theme";

export default function PaymentModal({
  visible,
  onClose,
  amount,
  email,
  onSuccess,
}) {
  // Format amount for display (e.g. 5,000)
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
            <View style={styles.badge}>
              <Ionicons name="lock-closed" size={12} color="white" />
              <CustomText style={styles.badgeText}>
                Secured by Paystack
              </CustomText>
            </View>
          </View>

          {/* The Paystack WebView */}
          <View style={{ flex: 1 }}>
            <Paystack
              // ⚠️ REPLACE WITH YOUR ACTUAL PUBLIC KEY FROM PAYSTACK DASHBOARD
              paystackKey="pk_test_bffa0c790c3fe5f02e846a9bf39e28e3b95207bd"
              amount={amount} // Library handles conversion automatically usually, or sends as is.
              billingEmail={email}
              currency="NGN"
              activityIndicatorColor={colors.primary}
              onCancel={(e) => {
                Alert.alert(
                  "Payment Cancelled",
                  "You cancelled the transaction.",
                );
                onClose(); // Just close modal
              }}
              onSuccess={(res) => {
                // res contains transaction reference
                onSuccess(res);
                onClose(); // Close modal after success
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
    backgroundColor: colors.gray100,
    borderRadius: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.gray50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  label: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    color: colors.gray900,
    marginBottom: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2DB06C", // Paystack green
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    marginLeft: 4,
    fontFamily: "Poppins_500Medium",
  },
});
