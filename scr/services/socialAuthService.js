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
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const firebaseTaskService = {
  // --- EXISTING TASK FUNCTIONS ---

  createTask: async (taskData) => {
    try {
      const taskRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdAt: serverTimestamp(),
        status: "pending",
        assignedTo: null,
        completedAt: null,
        bidsCount: 0, // Track number of bids
      });
      return { id: taskRef.id, ...taskData };
    } catch (error) {
      throw error.message;
    }
  },

  getClientTasks: async (userId, status = "") => {
    try {
      let q;
      if (status) {
        q = query(
          collection(db, "tasks"),
          where("clientId", "==", userId),
          where("status", "==", status),
          orderBy("createdAt", "desc"),
        );
      } else {
        q = query(
          collection(db, "tasks"),
          where("clientId", "==", userId),
          orderBy("createdAt", "desc"),
        );
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error.message;
    }
  },

  listenToClientTasks: (userId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    });
  },

  listenToAvailableTasks: (callback) => {
    const q = query(
      collection(db, "tasks"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    });
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      const updateData = { status };
      if (status === "completed") {
        updateData.completedAt = serverTimestamp();
      }
      await updateDoc(taskRef, updateData);
    } catch (error) {
      throw error.message;
    }
  },

 
  submitBid: async (
    taskId,
    taskerId,
    amount,
    note,
    taskerName,
    taskerPhoto,
  ) => {
    try {
      const bidsRef = collection(db, "tasks", taskId, "bids");
      await addDoc(bidsRef, {
        taskerId,
        taskerName,
        taskerPhoto: taskerPhoto || null,
        amount: parseFloat(amount),
        note,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      // Optional: Increment bid count on main task
      // await updateDoc(doc(db, "tasks", taskId), { bidsCount: increment(1) });

      return { success: true };
    } catch (error) {
      console.error("Error submitting bid:", error);
      throw error;
    }
  },

  /**
   * Real-time listener for bids on a specific task
   */
  listenToBidsForTask: (taskId, callback) => {
    const q = query(
      collection(db, "tasks", taskId, "bids"), // Targeting subcollection
      orderBy("amount", "asc"), // Order by lowest price first
    );

    return onSnapshot(q, (snapshot) => {
      const bids = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(bids);
    });
  },

  /**
   * Accept a bid: Updates task status and rejects other bids
   */
  acceptBid: async (taskId, bidId, taskerId, price, taskerName) => {
    try {
      const batch = writeBatch(db);

      // 1. Update the Main Task
      const taskRef = doc(db, "tasks", taskId);
      batch.update(taskRef, {
        status: "accepted",
        assignedTo: taskerId,
        taskerName: taskerName,
        price: parseFloat(price),
        acceptedAt: serverTimestamp(),
      });

      // 2. Mark the selected bid as accepted
      const selectedBidRef = doc(db, "tasks", taskId, "bids", bidId);
      batch.update(selectedBidRef, { status: "accepted" });

      // 3. Reject all other bids (Optional but recommended)
      const otherBidsQuery = query(
        collection(db, "tasks", taskId, "bids"),
        where("status", "==", "pending"),
      );
      const otherBidsSnapshot = await getDocs(otherBidsQuery);

      otherBidsSnapshot.forEach((doc) => {
        if (doc.id !== bidId) {
          batch.update(doc.ref, { status: "rejected" });
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error("Error accepting bid:", error);
      throw error;
    }
  },
};
