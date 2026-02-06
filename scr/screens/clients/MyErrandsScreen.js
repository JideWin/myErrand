// src/screens/client/MyErrandsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused

const MyErrandsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused(); // Hook to check if screen is focused

  useEffect(() => {
    if (!user || !isFocused) {
      // If user is not logged in or screen is not focused, do nothing
      if (!user) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Set up real-time listener for client's tasks
    const unsubscribe = firebaseTaskService.listenToClientTasks(
      user.uid,
      (allTasks) => {
        setTasks(allTasks);
        setIsLoading(false);
      }
    );

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [user, isFocused]); // Re-run when user or isFocused changes

  const getStatusColorStyle = (status) => {
    switch (status) {
      case "completed":
        return styles.statusCompleted;
      case "accepted":
      case "in-progress":
        return styles.statusProgress;
      case "pending":
        return styles.statusPending;
      default:
        return {};
    }
  };

  const renderErrandItem = ({ item }) => (
    <TouchableOpacity
      style={styles.errandCard}
      onPress={() => navigation.navigate("JobDetails", { job: item })}
    >
      <View style={styles.errandHeader}>
        <Text style={styles.errandTitle}>{item.title}</Text>
        <Text style={[styles.status, getStatusColorStyle(item.status)]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.errandDetails}>
        Budget: {item.price || item.budget}
      </Text>
      <Text style={styles.errandDetails}>
        Tasker: {item.taskerName || "Not assigned yet"}
      </Text>
      {/* Format timestamp if it exists */}
      {item.createdAt && (
        <Text style={styles.errandDetails}>
          Posted: {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "active") {
      return (
        task.status === "pending" ||
        task.status === "accepted" ||
        task.status === "in-progress"
      );
    }
    if (activeTab === "completed") {
      return task.status === "completed";
    }
    return false;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Errands</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={{ marginTop: 40 }}
          />
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === "active"
                ? "No active errands"
                : "No completed errands yet"}
            </Text>
          </View>
        ) : (
          filteredTasks.map((item) => (
            <View key={item.id}>{renderErrandItem({ item })}</View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    paddingTop: 40, // More padding for safe area
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
  },
  tabText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  activeTabText: {
    color: "#3498db",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errandCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  errandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  errandTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1, // Ensure title doesn't push status off-screen
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "capitalize", // Show status nicely
    marginLeft: 8,
  },
  statusPending: {
    backgroundColor: "#ffeaa7",
    color: "#d35400",
  },
  statusProgress: {
    backgroundColor: "#81ecec",
    color: "#00cec9",
  },
  statusCompleted: {
    backgroundColor: "#55efc4",
    color: "#00b894",
  },
  errandDetails: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});

export default MyErrandsScreen;
