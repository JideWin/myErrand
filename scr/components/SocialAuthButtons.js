import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { colors } from "./theme";

WebBrowser.maybeCompleteAuthSession();

const SocialAuthButtons = () => {
  // --- GOOGLE CONFIGURATION ---
  // You need to get these Client IDs from the Google Cloud Console (Firebase Console)
  const [gRequest, gResponse, gPromptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // Replace with your Web Client ID
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com", // Optional: For native iOS
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com", // Optional: For native Android
  });

  // --- FACEBOOK CONFIGURATION ---
  // You need to get this App ID from developers.facebook.com
  const [fRequest, fResponse, fPromptAsync] = Facebook.useAuthRequest({
    clientId: "YOUR_FACEBOOK_APP_ID", // Replace with your Facebook App ID
    responseType: ResponseType.Token,
  });

  // Handle Google Response
  useEffect(() => {
    if (gResponse?.type === "success") {
      const { id_token } = gResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .catch((error) => Alert.alert("Google Login Error", error.message));
    }
  }, [gResponse]);

  // Handle Facebook Response
  useEffect(() => {
    if (fResponse?.type === "success") {
      const { access_token } = fResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .catch((error) => Alert.alert("Facebook Login Error", error.message));
    }
  }, [fResponse]);

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.row}>
        {/* Google Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => gPromptAsync()}
          disabled={!gRequest}
        >
          <Image 
            source={require("../../assets/images/google.png")} 
            style={styles.icon} 
            resizeMode="contain"
          />
          <Text style={styles.text}>Google</Text>
        </TouchableOpacity>

        {/* Facebook Button */}
        <TouchableOpacity
          style={[styles.button, styles.facebookButton]}
          onPress={() => fPromptAsync()}
          disabled={!fRequest}
        >
          <Image 
            source={require("../../assets/images/facebook.png")} 
            style={styles.icon} 
            resizeMode="contain"
          />
          <Text style={[styles.text, styles.facebookText]}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  orText: {
    marginHorizontal: 10,
    color: colors.gray500,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: 12,
    borderRadius: 8,
  },
  facebookButton: {
    backgroundColor: '#1877F2', // Facebook Blue
    borderColor: '#1877F2',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    color: colors.gray800,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  facebookText: {
    color: colors.white,
  },
});

export default SocialAuthButtons;