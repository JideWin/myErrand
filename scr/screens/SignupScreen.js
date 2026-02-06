// src/screens/SignupScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { CustomText } from "../components/CustomText";
import { colors } from "../components/theme";
import Button from "../components/Button";
import { globalStyles } from "../styles/GlobalStyles";

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp, isLoading, error } = useAuth();

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSignup = async () => {
    // Basic Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        // Role is NOT set here. It is set in RoleSelectionScreen.
        role: null,
      });
      // Navigation is handled by AuthContext or we can explicit move
      navigation.reset({ index: 0, routes: [{ name: "RoleSelection" }] });
    } catch (e) {
      console.error("Signup Error", e);
      // Error is displayed via AuthContext state usually
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={{ marginTop: 20, marginBottom: 32 }}>
            <CustomText type="h2" style={styles.title}>
              Create Account
            </CustomText>
            <CustomText type="body" style={styles.subtitle}>
              Join myErrand today
            </CustomText>
          </View>

          {error && <CustomText style={styles.errorText}>{error}</CustomText>}

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <CustomText style={globalStyles.inputLabel}>
                First Name
              </CustomText>
              <TextInput
                style={globalStyles.input}
                placeholder="John"
                value={formData.firstName}
                onChangeText={(text) => updateForm("firstName", text)}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <CustomText style={globalStyles.inputLabel}>Last Name</CustomText>
              <TextInput
                style={globalStyles.input}
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(text) => updateForm("lastName", text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={globalStyles.inputLabel}>
              Email Address
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="you@example.com"
              value={formData.email}
              onChangeText={(text) => updateForm("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={globalStyles.inputLabel}>
              Phone Number
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="+234..."
              value={formData.phone}
              onChangeText={(text) => updateForm("phone", text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={globalStyles.inputLabel}>Password</CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="Min 6 chars"
              value={formData.password}
              onChangeText={(text) => updateForm("password", text)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={globalStyles.inputLabel}>
              Confirm Password
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateForm("confirmPassword", text)}
              secureTextEntry
            />
          </View>

          <Button
            onPress={handleSignup}
            loading={isLoading}
            style={{ marginTop: 24 }}
          >
            Sign Up
          </Button>

          <View style={styles.footer}>
            <CustomText style={{ color: colors.gray600 }}>
              Already have an account?{" "}
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <CustomText style={styles.linkText}>Sign In</CustomText>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, flexGrow: 1 },
  backButton: { marginBottom: 16 },
  title: { color: colors.gray900, marginBottom: 8 },
  subtitle: { color: colors.gray500 },
  errorText: { color: colors.error, textAlign: "center", marginBottom: 16 },

  row: { flexDirection: "row", marginBottom: 16 },
  inputContainer: { marginBottom: 16 },

  linkText: {
    color: colors.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
});

export default SignupScreen;
