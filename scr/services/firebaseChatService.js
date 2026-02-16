import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Add Storage
import { db } from "../config/firebase";

export const firebaseChatService = {
  // 1. Send a Text Message
  sendMessage: async (taskId, senderId, text) => {
    try {
      await addDoc(collection(db, "chats"), {
        taskId: taskId,
        senderId: senderId,
        text: text,
        type: "text", // identify message type
        read: false, // for read receipts
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // 2. Send an Image (New Feature for Professional Apps)
  sendImage: async (taskId, senderId, imageUri) => {
    try {
      const storage = getStorage();
      const filename = `chats/${taskId}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      // Convert URI to Blob (needed for React Native)
      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "chats"), {
        taskId: taskId,
        senderId: senderId,
        imageUrl: downloadURL,
        type: "image",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending image:", error);
      throw error;
    }
  },

  // 3. Mark Messages as Read
  markAsRead: async (messageId) => {
    try {
      const msgRef = doc(db, "chats", messageId);
      await updateDoc(msgRef, { read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  },

  // 4. Listen for Messages
  listenToMessages: (taskId, callback) => {
    const q = query(
      collection(db, "chats"),
      where("taskId", "==", taskId),
      orderBy("createdAt", "asc"),
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to Date object for UI libraries (like GiftedChat)
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      callback(messages);
    });
  },
};
