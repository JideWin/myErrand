import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";
import Button from "../../components/Button";

const PaymentScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { jobId, amount, taskerName } = params;

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  useEffect(() => {
    if (!jobId || !amount) {
      Alert.alert("Error", "Payment details missing. Please go back.", [
        { text: "Go Back", onPress: () => navigation.goBack() },
      ]);
    }
  }, [jobId, amount]);

  if (!jobId || !amount) return <View style={styles.container} />;

  // Calculate Fees (5%)
  const subtotal = parseFloat(amount);
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const handlePayNow = async () => {
    setLoading(true);
    // Simulate payment delay
    setTimeout(async () => {
      try {
        // 1. Mark Job as Paid
        const jobRef = doc(db, "tasks", jobId);
        await updateDoc(jobRef, {
          status: "Completed",
          paymentStatus: "Paid",
          paidAmount: total,
          completedAt: serverTimestamp(),
        });

        // 2. Record Transaction
        await addDoc(collection(db, "transactions"), {
          jobId: jobId,
          amount: total,
          method: selectedMethod,
          status: "Success",
          createdAt: serverTimestamp(),
        });

        setLoading(false);
        Alert.alert(
          "Success!",
          `Payment of ₦${total.toLocaleString()} to ${taskerName} successful.`,
          [{ text: "Done", onPress: () => navigation.navigate("ClientMain") }],
        );
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "Payment failed. Please try again.");
      }
    }, 2000);
  };

  const PaymentOption = ({ id, label, icon, subLabel }) => (
    <TouchableOpacity
      style={[styles.option, selectedMethod === id && styles.selectedOption]}
      onPress={() => setSelectedMethod(id)}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.iconBox}>
          <Icon
            name={icon}
            size={24}
            color={selectedMethod === id ? colors.primary : colors.gray500}
          />
        </View>
        <View style={{ marginLeft: 15 }}>
          <CustomText type="h4">{label}</CustomText>
          <CustomText type="caption" color="gray500">
            {subLabel}
          </CustomText>
        </View>
      </View>
      <View style={styles.radioOuter}>
        {selectedMethod === id && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={colors.gray800} />
          </TouchableOpacity>
          <CustomText type="h3">Checkout</CustomText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.amountCard}>
          <CustomText color="gray500" style={{ textTransform: "uppercase" }}>
            Total to Pay
          </CustomText>
          <CustomText
            type="h1"
            color="primary"
            style={{ fontSize: 40, marginTop: 5 }}
          >
            ₦{total.toLocaleString()}
          </CustomText>
        </View>

        <View style={styles.section}>
          <CustomText type="h4" style={{ marginBottom: 10 }}>
            Payment Summary
          </CustomText>
          <View style={styles.row}>
            <CustomText color="gray600">Job Price</CustomText>
            <CustomText>₦{subtotal.toLocaleString()}</CustomText>
          </View>
          <View style={styles.row}>
            <CustomText color="gray600">Service Fee (5%)</CustomText>
            <CustomText>₦{serviceFee.toLocaleString()}</CustomText>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <CustomText type="bold">Total</CustomText>
            <CustomText type="bold" color="primary">
              ₦{total.toLocaleString()}
            </CustomText>
          </View>
        </View>

        <View style={styles.section}>
          <CustomText type="h4" style={{ marginBottom: 10 }}>
            Select Method
          </CustomText>
          <PaymentOption
            id="card"
            label="Debit Card"
            subLabel="**** 1234"
            icon="card"
          />
          <PaymentOption
            id="wallet"
            label="My Wallet"
            subLabel="Balance: ₦50,000"
            icon="wallet"
          />
          <PaymentOption
            id="cash"
            label="Cash"
            subLabel="Pay Tasker directly"
            icon="cash"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Pay ₦${total.toLocaleString()}`}
          onPress={handlePayNow}
          loading={loading}
          icon="lock-closed"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Icon name="shield-checkmark" size={14} color={colors.gray500} />
          <CustomText type="caption" color="gray500" style={{ marginLeft: 5 }}>
            Secure Payment
          </CustomText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { padding: spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  amountCard: {
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  section: { marginBottom: spacing.xl },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.gray200,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "05",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray400,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.gray200,
  },
});

export default PaymentScreen;
