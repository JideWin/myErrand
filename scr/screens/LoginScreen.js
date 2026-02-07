import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
// FIXED: Replaced standard SafeAreaView with modern context
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { CustomText } from "../components/CustomText";
import { colors } from "../components/theme";
import Button from "../components/Button";

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("+234");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const { signInWithPhone, confirmPhoneCode, isLoading } = useAuth();

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Number", "Please enter a valid phone number.");
      return;
    }
    try {
      const confirmationResult = await signInWithPhone(phoneNumber);
      setConfirmation(confirmationResult);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleConfirmCode = async () => {
    try {
      await confirmPhoneCode(code);
    } catch (e) {
      Alert.alert("Verification Failed", e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.inner}>
        <CustomText type="h1" style={styles.title}>
          {confirmation ? "Enter OTP" : "Welcome Back"}
        </CustomText>

        {!confirmation ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Button
              title="Send Code"
              onPress={handleSendCode}
              loading={isLoading}
            />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="6-digit OTP"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            <Button
              title="Verify"
              onPress={handleConfirmCode}
              loading={isLoading}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inner: { padding: 20, justifyContent: "center", flex: 1 },
  title: { marginBottom: 30, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default LoginScreen;
