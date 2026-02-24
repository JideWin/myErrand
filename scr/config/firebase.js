import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPLHUTpOB08sWXiHjHSOEJxmJRysezZS8",
  authDomain: "myerrandapp-c66f0.firebaseapp.com",
  projectId: "myerrandapp-c66f0",
  storageBucket: "myerrandapp-c66f0.firebasestorage.app",
  messagingSenderId: "451325436790",
  appId: "1:451325436790:web:58435155091fe3a62b9057",
};

// 1. Initialize Firebase App securely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize Auth with Persistence securely
let auth;
try {
  // Try to initialize with AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If it fails (meaning Metro already initialized it), just get the existing instance
  auth = getAuth(app);
}

// 3. Initialize other services
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
