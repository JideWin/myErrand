// src/services/firebaseTaskService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp, // Import serverTimestamp
  writeBatch, // Import writeBatch
} from "firebase/firestore";
import { db } from "../config/firebase";

export const firebaseTaskService = {
  // Create a new task
  createTask: async (taskData) => {
    try {
      const taskRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdAt: serverTimestamp(), // Use server timestamp
        status: "pending",
        assignedTo: null,
        completedAt: null,
      });

      return { id: taskRef.id, ...taskData };
    } catch (error) {
      throw error.message;
    }
  },

  // Get tasks for client (example of a non-listener fetch)
  getClientTasks: async (userId, status = "") => {
    try {
      let q;
      if (status) {
        q = query(
          collection(db, "tasks"),
          where("clientId", "==", userId),
          where("status", "==", status),
          orderBy("createdAt", "desc")
        );
      } else {
        q = query(
          collection(db, "tasks"),
          where("clientId", "==", userId),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error.message;
    }
  },

  // Real-time listener for tasks for a specific client
  listenToClientTasks: (userId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    });
  },

  // Get available tasks for taskers (Non-listener)
  getAvailableTasks: async (filters = {}) => {
    try {
      let q = query(
        collection(db, "tasks"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error.message;
    }
  },

  // --- NEW ---
  // Real-time listener for available tasks for taskers
  listenToAvailableTasks: (callback) => {
    const q = query(
      collection(db, "tasks"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    });
  },

  // Accept a task (Instant Accept) - UPDATED
  acceptTask: async (taskId, tasker) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "accepted",
        assignedTo: tasker.uid,
        taskerName: `${tasker.firstName} ${tasker.lastName}`,
        taskerPhoto: tasker.photoURL || null,
        acceptedAt: serverTimestamp(), // Use server timestamp
      });
    } catch (error) {
      console.error("Error accepting task:", error);
      throw new Error("Failed to accept task.");
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const updateData = { status };

      if (status === "completed") {
        updateData.completedAt = serverTimestamp(); // Use server timestamp
      }

      await updateDoc(taskRef, updateData);
    } catch (error) {
      throw error.message;
    }
  },

  // Real-time listener for tasks (general, might be for tasker)
  listenToTasks: (userId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", userId), // This is still client-focused, adjust as needed
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    });
  },

  // --- NEW BIDDING FUNCTIONS ---

  /**
   * Creates a new bid for a task.
   * @param {object} bidData - Data for the new bid.
   * { taskId, taskerId, taskerName, taskerPhoto, bidAmount, message }
   */
  createBid: async (bidData) => {
    try {
      const bidsCollection = collection(db, "bids");
      await addDoc(bidsCollection, {
        ...bidData,
        createdAt: serverTimestamp(),
        status: "pending", // 'pending', 'accepted', 'rejected'
      });
    } catch (error) {
      console.error("Error creating bid:", error);
      throw new Error("Failed to create bid.");
    }
  },

  /**
   * Listens for real-time bids on a specific task.
   * @param {string} taskId - The ID of the task.
   * @param {function} callback - Function to call with the new bids array.
   * @returns {function} - The unsubscribe function.
   */
  listenToBidsForTask: (taskId, callback) => {
    const q = query(
      collection(db, "bids"),
      where("taskId", "==", taskId),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const bids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(bids);
    });
  },

  /**
   * Accepts a bid, updates the task, and rejects other bids.
   * @param {string} taskId - The ID of the task.
   * @param {object} acceptedBid - The full bid object that was accepted.
   */
  acceptBid: async (taskId, acceptedBid) => {
    try {
      // 1. Update the task document
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: "accepted",
        assignedTo: acceptedBid.taskerId,
        taskerName: acceptedBid.taskerName, // Store tasker name on task
        taskerPhoto: acceptedBid.taskerPhoto, // Store tasker photo on task
        price: acceptedBid.bidAmount, // Update task price to the bid amount
        acceptedAt: serverTimestamp(),
      });

      // 2. Update the accepted bid document
      const acceptedBidRef = doc(db, "bids", acceptedBid.id);
      await updateDoc(acceptedBidRef, {
        status: "accepted",
      });

      // (Optional but recommended) 3. Reject all other bids for this task
      const otherBidsQuery = query(
        collection(db, "bids"),
        where("taskId", "==", taskId),
        where("status", "==", "pending")
      );
      const otherBidsSnapshot = await getDocs(otherBidsQuery);

      const batch = writeBatch(db); // Use a batch for efficiency
      otherBidsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: "rejected" });
      });
      await batch.commit();
    } catch (error) {
      console.error("Error accepting bid:", error);
      throw new Error("Failed to accept bid.");
    }
  },
};
