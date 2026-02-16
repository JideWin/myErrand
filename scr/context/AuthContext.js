import React, { createContext, useState, useEffect, useContext } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // For spinner on buttons

  // 1. Monitor User Session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        // Fetch extra user details (Role, Name) from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", authenticatedUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...authenticatedUser, ...userData });
            setUserRole(userData.role);
          } else {
            setUser(authenticatedUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Sign Up Function (Matches your SignupScreen)
  const signUp = async (email, password, name, role, phone) => {
    setIsLoading(true);
    try {
      // Create Auth User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;

      // Save to Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        displayName: name,
        email: email,
        phoneNumber: phone,
        role: role, // 'client' or 'tasker'
        createdAt: new Date().toISOString(),
        isVerified: false,
        walletBalance: 0,
        rating: 5.0, // Default rating
      });

      // Send Verification Email
      await sendEmailVerification(newUser);

      // Update Local State immediately so UI updates
      setUserRole(role);
    } catch (error) {
      // Throw error so Screen can catch it and alert user
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Login Function (Matches your LoginScreen)
  const signInWithEmail = async (email, password) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Logout Function
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading, // For initial app load
        isLoading, // For button spinners
        signUp, // <--- Now exists!
        signInWithEmail, // <--- Now exists!
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
