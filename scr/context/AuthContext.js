// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  signInWithPhoneNumber, // Import phone auth function
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebase";
import { storageService } from "../services/services/storageService";
import { db } from "../config/firebase";
import { useSocialAuth } from "../services/socialAuthService";

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "RESTORE_USER":
    // ... existing code ...
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
    // ... existing code ...
  }
};

// Initial state
const initialState = {
  // ... existing code ...
  error: null,
};

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const {
    signInWithGoogle: socialGoogleSignIn,
    signInWithFacebook: socialFacebookSignIn,
  } = useSocialAuth();

  // Check for existing user on app start
  useEffect(() => {
    // ... existing code ...
    return () => unsubscribe();
  }, []);

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
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: provider,
        };
        await setDoc(userRef, userData);
      } else {
        userData = userDoc.data();
      }
      await storageService.setItem("userData", userData);
      return userData;
    } catch (error) {
      console.error("Error handling social user:", error);
      throw error;
    }
  };

  // Social auth methods
  const signInWithGoogle = async () => {
    try {
      dispatch({ type: "SET_SOCIAL_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      // call the social auth service to sign in with Google
      const firebaseUser = await socialGoogleSignIn();
      const userData = await handleSocialUser(firebaseUser, "google");

      dispatch({ type: "SIGN_IN", payload: userData });
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code || error.message);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_SOCIAL_LOADING", payload: false });
    }
  };

  const signInWithFacebook = async () => {
    try {
      dispatch({ type: "SET_SOCIAL_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      // call the social auth service to sign in with Facebook
      const firebaseUser = await socialFacebookSignIn();
      const userData = await handleSocialUser(firebaseUser, "facebook");

      dispatch({ type: "SIGN_IN", payload: userData });
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code || error.message);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_SOCIAL_LOADING", payload: false });
    }
  };

  // --- NEW PHONE AUTH METHODS ---

  const signInWithPhone = async (phoneNumber, verifier) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        verifier
      );

      dispatch({ type: "SET_LOADING", payload: false });
      return confirmationResult; // Return this to the UI to hold in state
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      throw new Error(errorMsg); // Throw error to be caught in UI
    }
  };

  const confirmPhoneCode = async (confirmationResult, code) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const userCredential = await confirmationResult.confirm(code);

      // We have a user! Now check if they exist in Firestore
      // We can reuse handleSocialUser for this logic
      const userData = await handleSocialUser(userCredential.user, "phone");

      dispatch({ type: "SIGN_IN", payload: userData });
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // --- END NEW PHONE AUTH METHODS ---

  // Email/Password Auth
  const signIn = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Try to fetch existing user data from Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      let userData;

      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || "",
          photoURL: userCredential.user.photoURL || "",
          provider: "password",
        };
        await setDoc(userRef, userData);
      }

      await storageService.setItem("userData", userData);
      dispatch({ type: "SIGN_IN", payload: userData });
      return { success: true, user: userData };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code || error.message);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signUp = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update the user profile
      await updateProfile(userCredential.user, {
        displayName: userData.displayName,
      });

      // Create user document in Firestore
      const userDoc = {
        uid: userCredential.user.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: "",
        provider: "password",
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userDoc);
      await storageService.setItem("userData", userDoc);

      dispatch({ type: "SIGN_UP", payload: userDoc });
      return { success: true, user: userDoc };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const signOut = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await auth.signOut();
      await storageService.removeItem("userData");
      dispatch({ type: "SIGN_OUT" });
      return { success: true };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const clearError = () => {
    // ... existing code ...
  };

  const updateUser = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "CLEAR_ERROR" });

      if (userData.displayName) {
        await updateProfile(auth.currentUser, {
          displayName: userData.displayName,
        });
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, userData, { merge: true });

      dispatch({ type: "UPDATE_USER", payload: userData });
      return { success: true };
    } catch (error) {
      const errorMsg = getAuthErrorMessage(error.code);
      dispatch({ type: "AUTH_ERROR", payload: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Context value
  const contextValue = {
    // ... existing code ...
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithPhone, // Add new function
    confirmPhoneCode, // Add new function
    clearError,
    updateUser,
    // ... existing code ...
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Helper function for error messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
    // ... existing code ...
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    // --- ADD PHONE AUTH ERRORS ---
    case "auth/invalid-phone-number":
      return "The phone number is not valid.";
    case "auth/missing-phone-number":
      return "Please enter a phone number.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/invalid-verification-code":
      return "The OTP code is incorrect. Please try again.";
    case "auth/code-expired":
      return "The OTP code has expired. Please request a new one.";
    // --- END PHONE AUTH ERRORS ---
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
