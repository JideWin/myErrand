// src/services/firebaseChatService.js
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Define the path for the messages sub-collection
const getMessagesCollection = (taskId) => {
  return collection(db, "chats", taskId, "messages");
};

/**
 * Listens for real-time message updates for a specific task.
 * @param {string} taskId - The ID of the task (which acts as the chat room ID).
 * @param {function} callback - Function to call with the new messages array.
 * @returns {function} - The unsubscribe function from onSnapshot.
 */
export const listenToMessages = (taskId, callback) => {
  const messagesCollection = getMessagesCollection(taskId);
  const q = query(messagesCollection, orderBy("createdAt", "asc"));

  // onSnapshot returns an unsubscribe function
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });

  return unsubscribe;
};

/**
 * Sends a new message to a chat room.
 * @param {string} taskId - The ID of the task (chat room).
 * @param {object} messageData - The message object to send.
 */
export const sendMessage = async (taskId, messageData) => {
  try {
    const messagesCollection = getMessagesCollection(taskId);
    await addDoc(messagesCollection, {
      ...messageData,
      createdAt: serverTimestamp(), // Use server timestamp for reliable ordering
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
};
