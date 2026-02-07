import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
// FIXED: Modern Safe Area Import
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../components/CustomText";
import Button from "../components/Button";
import { colors } from "../components/theme";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/myErrandTeal.png")} // Ensure this path is correct
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <CustomText type="h1" align="center" style={styles.title}>
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
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    marginBottom: 10,
    color: colors.primary,
  },
  subtitle: {
    color: colors.gray500,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
  },
});

export default OnboardingScreen;
