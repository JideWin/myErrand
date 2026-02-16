import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBPLHUTpOB08sWXiHjHSOEJxmJRysezZS8", // Use your actual key
  authDomain: "myerrandapp-c66f0.firebaseapp.com",
  projectId: "myerrandapp-c66f0",
  storageBucket: "myerrandapp-c66f0.firebasestorage.app", // Ensure this matches exactly
  messagingSenderId: "451325436790",
  appId: "1:451325436790:web:58435155091fe3a62b9057",
};

// 1. Check if Firebase is already initialized (Prevents "Not Registered" & "Duplicate App" errors)
let app;
let auth;

if (getApps().length === 0) {
  // First time initialization
  app = initializeApp(firebaseConfig);

  // Initialize Auth with Persistence (Keeps user logged in)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  // App already exists, just get it
  app = getApp();
  auth = getAuth(app);
}

// 2. Initialize Services
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
