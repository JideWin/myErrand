import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// 1. Create the Context
export const AuthContext = createContext();

// 2. Define Initial State
const initialState = {
  user: null,
  isLoading: true,
};

// 3. Reducer to manage state updates
const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, user: action.payload, isLoading: false };
    case "SIGN_OUT":
      return { ...state, user: null, isLoading: false };
    case "INITIAL_CHECK_DONE":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

// 4. The Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // --- SESSION RESTORATION & LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ANTI-FREEZE: Create a 5-second timeout
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000),
          );

          // Race: Try to get profile from DB, but give up after 5s
          const userDoc = await Promise.race([
            getDoc(doc(db, "users", firebaseUser.uid)),
            timeout,
          ]);

          if (userDoc.exists()) {
            // Success: User found in DB
            const userData = userDoc.data();
            dispatch({
              type: "SIGN_IN",
              payload: { ...firebaseUser, ...userData },
            });
          } else {
            // Fallback: User in Auth but not DB -> Force Client Role
            console.log("User doc not found, using fallback role.");
            const fallbackUser = { ...firebaseUser, role: "client" };
            dispatch({ type: "SIGN_IN", payload: fallbackUser });
          }
        } catch (error) {
          console.log(
            "Login Fallback Triggered (Network/Timeout):",
            error.message,
          );
          // Fallback: Network is slow -> Force Client Role so they can get in
          const fallbackUser = { ...firebaseUser, role: "client" };
          dispatch({ type: "SIGN_IN", payload: fallbackUser });
        }
      } else {
        // No user logged in
        dispatch({ type: "SIGN_OUT" });
      }

      // Stop the global loading spinner (for the Splash Screen)
      if (state.isLoading) {
        dispatch({ type: "INITIAL_CHECK_DONE" });
      }
    });

    return unsubscribe;
  }, []);

  // --- ACTIONS ---

  const signUp = async (email, password, name, role, phone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update Display Name
      await updateProfile(user, { displayName: name });

      // Save to Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role || "client",
        phone: phone || "",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // Send Verification Email (Best effort, don't block if fails)
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.log("Email verification skipped:", e.message);
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      dispatch({ type: "SIGN_OUT" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, signUp, signInWithEmail, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom Hook for easy access
export const useAuth = () => useContext(AuthContext);
