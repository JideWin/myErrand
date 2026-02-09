// scr/services/firebaseTaskService.js
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
  // Create a new task
  createTask: async (taskData) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Listen to tasks posted by a specific client
  listenToClientTasks: (clientId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", clientId),
      orderBy("createdAt", "desc"),
    );
    // Returns the unsubscribe function directly
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    });
  },

  // Listen to available tasks for Taskers (Open status)
  listenToAvailableTasks: (callback) => {
    const q = query(
      collection(db, "tasks"),
      where("status", "==", "Open"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tasks);
    });
  },

  // Listen to bids for a specific task
  listenToBidsForTask: (taskId, callback) => {
    const q = query(
      collection(db, "tasks", taskId, "bids"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const bids = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(bids);
    });
  },

  // Place a bid on a task
  placeBid: async (taskId, bidData) => {
    const batch = writeBatch(db);
    const bidRef = doc(collection(db, "tasks", taskId, "bids"));
    const taskRef = doc(db, "tasks", taskId);

    batch.set(bidRef, {
      ...bidData,
      createdAt: serverTimestamp(),
    });

    // Increment bid count on the task
    // Note: In a real app, use increment()
    batch.update(taskRef, {
      bidsCount: (bidData.bidsCount || 0) + 1,
    });

    await batch.commit();
    return bidRef.id;
  },

  // Accept a bid
  acceptBid: async (taskId, bidId, taskerId, amount, taskerName) => {
    const batch = writeBatch(db);
    const taskRef = doc(db, "tasks", taskId);
    const bidRef = doc(db, "tasks", taskId, "bids", bidId);

    // Update task status and assigned Tasker
    batch.update(taskRef, {
      status: "Assigned",
      assignedTo: taskerId,
      assignedTaskerName: taskerName,
      acceptedBidId: bidId,
      finalPrice: amount,
    });

    // Update the winning bid status
    batch.update(bidRef, {
      status: "Accepted",
    });

    await batch.commit();
  },

  // Listen to jobs assigned to a specific Tasker
  listenToTaskerJobs: (taskerId, callback) => {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", taskerId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(jobs);
    });
  },
};
