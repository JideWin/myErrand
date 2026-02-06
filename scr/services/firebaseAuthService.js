// src/services/firebaseAuthService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const firebaseAuthService = {
  // Sign up with email and password
  signUp: async (userData) => {
    try {
      const { email, password, firstName, lastName, phone, role } = userData;

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Update user profile with display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // 3. Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        phone,
        role,
        createdAt: new Date().toISOString(),
        completedTasks: 0,
        rating: 0,
        profileCompleted: true,
        // Role-specific fields
        ...(role === "client" && {
          totalTasksPosted: 0,
          averageSpending: 0,
        }),
        ...(role === "tasker" && {
          skills: [],
          availability: true,
          totalEarnings: 0,
          tasksCompleted: 0,
          rating: 5.0, // Default rating for new taskers
        }),
      };

      await setDoc(doc(db, "users", user.uid), userDoc);

      // 4. Return user data with Firebase token
      const token = await user.getIdToken();

      return {
        success: true,
        user: userDoc,
        token,
      };
    } catch (error) {
      console.error("Firebase signup error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Login with email and password
  login: async (email, password) => {
    try {
      // 1. Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        throw new Error("User data not found. Please contact support.");
      }

      const userData = userDoc.data();

      // 3. Get Firebase token
      const token = await user.getIdToken();

      return {
        success: true,
        user: userData,
        token,
      };
    } catch (error) {
      console.error("Firebase login error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error("Firebase logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Get persisted user with Firebase's built-in persistence
  getPersistedUser: async () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  },
};

// Helper function to convert Firebase error codes to user-friendly messages
const getAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please use a different email or try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
