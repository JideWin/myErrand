import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { CustomText } from "../components/CustomText";
import { colors, spacing } from "../components/theme";
import Button from "../components/Button";
import Icon from "../components/Icon";
import SocialAuthButtons from "../components/SocialAuthButtons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { signInWithEmail, user } = useAuth();

  // STOP SPINNER IF USER EXISTS
  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmail(email, password);
      // We rely on AppNavigator to switch screens automatically
    } catch (e) {
      console.error("Login Error:", e.code, e.message);
      setLoading(false);

      if (
        e.code === "auth/invalid-credential" ||
        e.code === "auth/user-not-found" ||
        e.code === "auth/wrong-password"
      ) {
        Alert.alert("Login Failed", "Incorrect email or password.");
      } else if (e.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "The email address is badly formatted.");
      } else if (e.code === "auth/network-request-failed") {
        Alert.alert(
          "Connection Error",
          "Please check your internet connection.",
        );
      } else {
        Alert.alert("Error", e.message);
      }
    }
  };

  // If user is already logged in, show a simple "Redirecting" view instead of the form
  if (user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <CustomText type="h2" color="primary">
          Welcome Back!
        </CustomText>
        <CustomText color="gray500" style={{ marginTop: 10 }}>
          Redirecting to Home...
        </CustomText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <CustomText type="h1" align="center" color="primary">
              Welcome Back
            </CustomText>
            <CustomText align="center" color="gray500">
              Login to continue using MyErrand
            </CustomText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <CustomText type="caption" style={styles.label}>
                Email Address
              </CustomText>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
                value={email}
                onChangeText={(text) => setEmail(text.trim())}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <CustomText type="caption" style={styles.label}>
                Password
              </CustomText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIcon}
                >
                  <Icon
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="gray500"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: spacing.md }}
            />

            <SocialAuthButtons />

            <View style={styles.footer}>
              <CustomText color="gray500">Don't have an account? </CustomText>
              <TouchableOpacity
                onPress={() => navigation.navigate("RoleSelection")}
              >
                <CustomText type="bold" color="primary">
                  Sign Up
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.lg, flexGrow: 1, justifyContent: "center" },
  header: { marginBottom: spacing.xl },
  form: { width: "100%" },
  inputGroup: { marginBottom: spacing.md },
  label: {
    marginBottom: 6,
    textTransform: "uppercase",
    fontSize: 12,
    color: colors.gray500,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: colors.gray50,
    color: colors.gray800,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    backgroundColor: colors.gray50,
  },
  passwordInput: {
    flex: 1,
    padding: spacing.md,
    fontSize: 16,
    color: colors.gray800,
  },
  eyeIcon: {
    padding: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});

export default LoginScreen;
