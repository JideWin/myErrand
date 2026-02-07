import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";

export const useSocialAuth = () => {
  const loginWithGoogle = async (idToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  return { loginWithGoogle };
};
