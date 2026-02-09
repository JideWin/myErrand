// scr/screens/OnboardingScreen.js
import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../components/CustomText";
import Button from "../components/Button";
import { colors, spacing } from "../components/theme";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/myErrandTeal.png")} // Ensure this image exists!
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <CustomText type="h1" align="center" color="primary">
            Welcome to MyErrand
          </CustomText>
          <CustomText align="center" style={styles.subtitle}>
            Connect with trusted runners to get your errands done quickly and
            safely.
          </CustomText>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate("RoleSelection")}
          />
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  image: {
    width: width * 0.8,
    height: height * 0.35,
    marginBottom: spacing.xl,
  },
  textContainer: {
    marginBottom: spacing.xl * 2,
    width: "100%",
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.gray500,
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: spacing.lg,
  },
});

export default OnboardingScreen;
