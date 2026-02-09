import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { CustomText } from "../components/CustomText";
import Button from "../components/Button";
import { colors, spacing } from "../components/theme";

const SignupScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: "client" };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, isLoading } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your name, email, and password.",
      );
      return;
    }

    try {
      // 1. Attempt Signup
      await signUp(email, password, name, role, phone);

      // 2. Show Success Alert
      Alert.alert(
        "Account Created!",
        "We have sent a verification link to your email. Please check your inbox.",
        [
          {
            text: "OK",
            // Navigation happens automatically via AuthContext, but this is safe backup
            onPress: () => console.log("Signup success acknowledged"),
          },
        ],
      );
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Account Exists",
          "This email is already registered. Would you like to log in?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Log In", onPress: () => navigation.navigate("Login") },
          ],
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <CustomText type="h1" color="primary">
            Create Account
          </CustomText>
          <CustomText color="gray500">
            Sign up as a{" "}
            <CustomText
              type="bold"
              color="accent"
              style={{ textTransform: "capitalize" }}
            >
              {role}
            </CustomText>
          </CustomText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <CustomText type="caption" style={styles.label}>
              Full Name
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText type="caption" style={styles.label}>
              Email Address
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText type="caption" style={styles.label}>
              Phone Number (Optional)
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="+234..."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText type="caption" style={styles.label}>
              Password
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="Min. 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
            style={{ marginTop: spacing.md }}
          />

          <View style={styles.footer}>
            <CustomText color="gray500">Already have an account? </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <CustomText type="bold" color="primary">
                Login
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.lg },
  header: { marginBottom: spacing.xl, marginTop: spacing.md },
  form: { marginTop: spacing.sm },
  inputGroup: { marginBottom: spacing.md },
  label: {
    marginBottom: 6,
    textTransform: "uppercase",
    fontSize: 12,
    color: colors.gray500,
  },
  input: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray200,
    fontSize: 16,
    color: colors.gray800,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
});

export default SignupScreen;
