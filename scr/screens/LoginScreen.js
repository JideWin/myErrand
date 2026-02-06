// src/screens/LoginScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FirebaseRecaptchaVerifier } from "expo-firebase-recaptcha";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase"; // Import the auth object
import { CustomText } from "../components/CustomText";
// FIXED: Updated path to point to components folder where theme.js resides
import { colors } from "../components/theme";
import Button from "../components/Button";
import { globalStyles } from "../styles/GlobalStyles";

const LoginScreen = ({ navigation }) => {
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState("+234");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null); // Will store the confirmation result

  const { signInWithPhone, confirmPhoneCode, isLoading, error } = useAuth();

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }
    try {
      const confirmationResult = await signInWithPhone(
        phoneNumber,
        recaptchaVerifier.current
      );
      setConfirmation(confirmationResult);
      Alert.alert("OTP Sent", `An OTP has been sent to ${phoneNumber}`);
    } catch (e) {
      console.error("Phone sign-in error:", e.message);
      Alert.alert("Error", e.message);
    }
  };

  const handleConfirmCode = async () => {
    if (code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit OTP.");
      return;
    }
    if (!confirmation) {
      Alert.alert("Error", "Please request an OTP first.");
      return;
    }
    try {
      const result = await confirmPhoneCode(confirmation, code);
      if (result.success) {
        // Navigation will be handled by the root navigator listening to AuthContext
        // But we can check if profile is complete
        if (!result.user.profileCompleted || !result.user.role) {
          navigation.navigate("RoleSelection");
        } else {
          // Role determines where to go
          if (result.user.role === "client") {
            navigation.navigate("ClientMain");
          } else if (result.user.role === "tasker") {
            navigation.navigate("TaskerMain");
          }
        }
      } else {
        Alert.alert("Login Failed", result.error);
      }
    } catch (e) {
      console.error("Code confirmation error:", e.message);
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Invisible reCAPTCHA verifier */}
      <FirebaseRecaptchaVerifier
        ref={recaptchaVerifier}
        firebaseConfig={auth.config} // Use your Firebase config
        // This is invisible. For dev, 'invisible' is fine.
        // For production, you must register your app's package name with Google
        verifierId="recaptcha-verifier"
        style={{ display: "none" }}
      />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <CustomText type="h2" style={styles.title}>
          {confirmation ? "Enter OTP" : "Welcome Back"}
        </CustomText>
        <CustomText type="body" style={styles.subtitle}>
          {confirmation
            ? `We sent a 6-digit code to ${phoneNumber}`
            : "Sign in with your phone number to continue."}
        </CustomText>

        {error && <CustomText style={styles.errorText}>{error}</CustomText>}

        {!confirmation ? (
          <>
            {/* Phone Number Input */}
            <CustomText style={globalStyles.inputLabel}>
              Phone Number
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g., +234 801 234 5678"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            <Button
              onPress={handleSendCode}
              loading={isLoading}
              style={{ marginTop: 20 }}
            >
              Send Code
            </Button>
          </>
        ) : (
          <>
            {/* OTP Code Input */}
            <CustomText style={globalStyles.inputLabel}>
              Verification Code
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <Button
              onPress={handleConfirmCode}
              loading={isLoading}
              style={{ marginTop: 20 }}
            >
              Confirm & Sign In
            </Button>
            <TouchableOpacity
              onPress={() => setConfirmation(null)}
              style={{ marginTop: 16 }}
            >
              <CustomText style={styles.resendText}>
                Use a different number?
              </CustomText>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <CustomText style={styles.dividerText}>or</CustomText>
          <View style={styles.divider} />
        </View>

        <Button
          variant="secondary"
          onPress={() =>
            Alert.alert(
              "Email/Password",
              "Email login not yet implemented in this screen."
            )
          }
        >
          Sign in with Email
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  title: {
    marginBottom: 8,
    color: colors.gray900,
  },
  subtitle: {
    marginBottom: 32,
    color: colors.gray600,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: "center",
  },
  resendText: {
    color: colors.primary,
    textAlign: "center",
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray500,
  },
});

export default LoginScreen;
