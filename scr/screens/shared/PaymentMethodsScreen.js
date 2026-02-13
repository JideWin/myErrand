import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";
import Button from "../../components/Button";

const PaymentMethodsScreen = ({ navigation }) => {
  const { user } = useAuth();

  // State for Data
  const [methods, setMethods] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // State for UI
  const [showAddCard, setShowAddCard] = useState(false);

  // State for New Card Form
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [adding, setAdding] = useState(false);

  // --- 1. REAL-TIME LISTENERS ---
  useEffect(() => {
    if (!user) return;

    // Listener A: Get Saved Cards
    const cardsQuery = query(
      collection(db, "paymentMethods"),
      where("userId", "==", user.uid),
    );
    const unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMethods(list);
      setLoading(false);
    });

    // Listener B: Get Wallet Balance (Live Updates)
    const userRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Default to 0 if walletBalance doesn't exist yet
        setBalance(userData.walletBalance || 0);
      }
    });

    // Cleanup listeners when leaving screen
    return () => {
      unsubscribeCards();
      unsubscribeUser();
    };
  }, [user]);

  // --- 2. ACTIONS ---

  const handleAddCard = async () => {
    if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
      Alert.alert("Invalid Input", "Please check your card details.");
      return;
    }

    setAdding(true);
    try {
      await addDoc(collection(db, "paymentMethods"), {
        userId: user.uid,
        type: "card",
        last4: cardNumber.slice(-4),
        brand: "MasterCard", // You can add logic to detect Visa/MasterCard
        expiry: expiry,
        createdAt: new Date(),
      });

      // Reset Form
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setShowAddCard(false);
      Alert.alert("Success", "Card added successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save card.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Remove Card", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => await deleteDoc(doc(db, "paymentMethods", id)),
      },
    ]);
  };

  // --- 3. RENDER ---

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.gray800} />
          </TouchableOpacity>
          <CustomText type="h3" style={{ marginLeft: 15 }}>
            Payment Methods
          </CustomText>
        </View>

        {/* Wallet Balance Card */}
        <View style={[styles.walletCard, shadows.medium]}>
          <View>
            <CustomText color="white" style={{ opacity: 0.9, fontSize: 14 }}>
              My Wallet Balance
            </CustomText>
            <CustomText
              type="h1"
              color="white"
              style={{ marginTop: 8, fontSize: 32 }}
            >
              ₦
              {balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </CustomText>
          </View>
          <View style={styles.walletIcon}>
            <Icon name="wallet" size={28} color={colors.primary} />
          </View>
        </View>

        {/* Saved Cards List */}
        <View style={styles.section}>
          <CustomText type="h4" style={{ marginBottom: 15 }}>
            Saved Cards
          </CustomText>

          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : methods.length === 0 ? (
            <CustomText
              color="gray500"
              style={{ fontStyle: "italic", marginBottom: 10 }}
            >
              No cards saved yet.
            </CustomText>
          ) : (
            methods.map((item) => (
              <View key={item.id} style={styles.cardItem}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="card" size={24} color={colors.primary} />
                  <View style={{ marginLeft: 15 }}>
                    <CustomText type="bold">
                      **** **** **** {item.last4}
                    </CustomText>
                    <CustomText type="caption" color="gray500">
                      Expires {item.expiry}
                    </CustomText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ padding: 5 }}
                >
                  <Icon name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Add New Card Form */}
        {showAddCard ? (
          <View style={styles.addForm}>
            <CustomText type="h4" style={{ marginBottom: 15 }}>
              Add New Card
            </CustomText>

            <TextInput
              style={styles.input}
              placeholder="Card Number"
              keyboardType="numeric"
              maxLength={16}
              value={cardNumber}
              onChangeText={setCardNumber}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="CVV"
                keyboardType="numeric"
                maxLength={3}
                value={cvv}
                onChangeText={setCvv}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Button
                title="Cancel"
                type="outline"
                style={{ flex: 1 }}
                onPress={() => setShowAddCard(false)}
              />
              <Button
                title="Save Card"
                style={{ flex: 1 }}
                loading={adding}
                onPress={handleAddCard}
              />
            </View>
          </View>
        ) : (
          <Button
            title="Add New Card"
            icon="add"
            type="outline"
            onPress={() => setShowAddCard(true)}
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { padding: spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  walletCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { marginBottom: spacing.xl },
  cardItem: {
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
  addForm: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    ...shadows.small,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: spacing.md,
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;
