// src/styles/GlobalStyles.js
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Changed to white
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },

  // Text styles
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937", // Dark text for better contrast
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280", // Medium gray
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937", // Dark text
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: "#374151", // Dark gray
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: "#7a7e86ff", // Medium gray
  },

  // Button styles
  button: {
    backgroundColor: "#008080",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff", // White text on colored button
  },
  buttonOutline: {
    backgroundColor: "lightgray",
    borderWidth: 1,
    borderColor: "transparent", // Indigo border
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d11d5ff", // Indigo text
  },

  // Card styles
  card: {
    backgroundColor: "#f8fafc", // Light gray cards
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937", // Dark text
    marginBottom: 8,
  },

  // Input styles
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    color: "#1f2937", // Dark text
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151", // Dark gray
    marginBottom: 8,
  },

  // Status indicators
  status: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusPending: {
    backgroundColor: "#fffbeb",
    color: "#d97706", // Amber
  },
  statusProgress: {
    backgroundColor: "#eff6ff",
    color: "#2563eb", // Blue
  },
  statusCompleted: {
    backgroundColor: "#ecfdf5",
    color: "#059669", // Green
  },

  // Spacing
  mb16: {
    marginBottom: 16,
  },
  mb24: {
    marginBottom: 24,
  },
  mt16: {
    marginTop: 16,
  },
  mt24: {
    marginTop: 24,
  },
});
