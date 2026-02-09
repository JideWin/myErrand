import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const firebaseChatService = {
  // 1. Send a Message
  sendMessage: async (taskId, senderId, text) => {
    try {
      await addDoc(collection(db, "chats"), {
        taskId: taskId,
        senderId: senderId,
        text: text,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // 2. Listen for Messages (Real-time)
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
      }));
      callback(messages);
    });
  },
};
