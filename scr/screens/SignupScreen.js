import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
// FIXED: Modern Safe Area Import
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
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await signUp(email, password, name, role, phone);
      // Navigation is handled by AuthContext listener in App.js
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomText type="h1" style={styles.title}>
          Create Account
        </CustomText>
        <CustomText style={styles.subtitle}>
          Sign up as a{" "}
          <CustomText type="bold" color="primary">
            {role}
          </CustomText>
        </CustomText>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number (Optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={isLoading}
            style={{ marginTop: 20 }}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <CustomText align="center" color="gray500">
              Already have an account?{" "}
              <CustomText color="primary">Login</CustomText>
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
    color: colors.gray500,
  },
  form: {
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  loginLink: {
    marginTop: spacing.lg,
  },
});

export default SignupScreen;
