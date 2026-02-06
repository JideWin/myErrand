// src/services/socialAuthService.js
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";

// Create a simple web browser redirect
const openAuthSession = async (url) => {
  return await WebBrowser.openAuthSessionAsync(url);
};

export const useSocialAuth = () => {
  // Google configuration
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      expoClientId: "451325436790-6q6v8q2q3q4q5q6q7q8q9q0q1q2q3q4q5q6q7q8q9q0", // Replace with your actual client ID
      iosClientId: "YOUR_IOS_CLIENT_ID", // Replace if needed
      androidClientId: "YOUR_ANDROID_CLIENT_ID", // Replace if needed
      webClientId: "YOUR_WEB_CLIENT_ID", // Replace if needed
    });

  // Facebook configuration
  const [facebookRequest, facebookResponse, facebookPromptAsync] =
    Facebook.useAuthRequest({
      clientId: "YOUR_FACEBOOK_APP_ID", // Replace with your actual Facebook App ID
    });

  // Handle social user creation/update
  const handleSocialUser = async (firebaseUser, provider) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      let userData;

      if (!userDoc.exists()) {
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(" ")[0] || "User",
          lastName: firebaseUser.displayName?.split(" ")[1] || "",
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: provider,
          createdAt: new Date().toISOString(),
          completedTasks: 0,
          rating: 5.0,
          profileCompleted: false,
          role: "client",
          phone: "",
        };
        await setDoc(userRef, userData);
      } else {
        const existingData = userDoc.data();
        userData = {
          ...existingData,
          photoURL: firebaseUser.photoURL || existingData.photoURL,
          displayName: firebaseUser.displayName || existingData.displayName,
          provider: provider,
        };
        await setDoc(userRef, userData, { merge: true });
      }

      return userData;
    } catch (error) {
      console.error("Error handling social user:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Use promptAsync directly
      const result = await googlePromptAsync();

      if (result.type === "success") {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        const userData = await handleSocialUser(userCredential.user, "google");
        return { success: true, user: userData };
      }

      return {
        success: false,
        error:
          result.type === "cancel"
            ? "Google sign-in cancelled"
            : "Google sign-in failed",
      };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { success: false, error: error.message };
    }
  };

  const signInWithFacebook = async () => {
    try {
      // Use promptAsync directly
      const result = await facebookPromptAsync();

      if (result.type === "success") {
        const { access_token } = result.params;
        const credential = FacebookAuthProvider.credential(access_token);
        const userCredential = await signInWithCredential(auth, credential);

        const userData = await handleSocialUser(
          userCredential.user,
          "facebook"
        );
        return { success: true, user: userData };
      }

      return {
        success: false,
        error:
          result.type === "cancel"
            ? "Facebook sign-in cancelled"
            : "Facebook sign-in failed",
      };
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    signInWithGoogle,
    signInWithFacebook,
    googleResponse,
    facebookResponse,
  };
};
