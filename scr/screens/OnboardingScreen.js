// src/screens/OnboardingScreen.js
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CustomText } from "../components/CustomText";
import Button from "../components/Button";
import { colors } from "../components/theme";
import { globalStyles } from "../styles/GlobalStyles";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  const handleClearSession = async () => {
    try {
      await signOut();
      await AsyncStorage.clear();
      Alert.alert(
        "Success",
        "Session cleared. You can now sign up as a new user."
      );
    } catch (error) {
      console.error("Error clearing session:", error);
      Alert.alert("Error", "Failed to clear session.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {/* You can replace this with your own Image asset later */}
        <View style={styles.placeholderImage}>
          <CustomText type="h1" style={{ color: "white" }}>
            myErrand
          </CustomText>
        </View>
      </View>

      <View style={styles.content}>
        <CustomText type="h1" style={styles.title}>
          Errands made{" "}
          <CustomText type="h1" style={{ color: colors.primary }}>
            simple.
          </CustomText>
        </CustomText>

        <CustomText type="body" style={styles.subtitle}>
          Connect with trusted Taskers in Nigeria to get your daily tasks done
          efficiently and safely.
        </CustomText>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate("Signup")}
            size="large"
            style={{ marginBottom: 16 }}
          >
            Get Started
          </Button>

          <Button
            onPress={() => navigation.navigate("Login")}
            variant="secondary"
            size="large"
          >
            I have an account
          </Button>

          {/* Dev/Showcase Helper: Clear Session */}
          <TouchableOpacity
            onPress={handleClearSession}
            style={{ marginTop: 24, alignItems: "center" }}
          >
            <CustomText type="caption" style={{ color: colors.gray400 }}>
              Reset / Clear Session
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flex: 0.55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdfa", // Very light teal bg
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  placeholderImage: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: colors.primary,
    borderRadius: (width * 0.8) / 2,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  content: {
    flex: 0.45,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    color: colors.gray900,
  },
  subtitle: {
    textAlign: "center",
    color: colors.gray500,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: "100%",
  },
});

export default OnboardingScreen;
