// scr/config/firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPLHUTpOB08sWXiHjHSOEJxmJRysezZS8",
  authDomain: "myerrandapp-c66f0.firebaseapp.com",
  projectId: "myerrandapp-c66f0",
  storageBucket: "myerrandapp-c66f0.firebasestorage.app",
  messagingSenderId: "451325436790",
  appId: "1:451325436790:web:58435155091fe3a62b9057",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
