// src/screens/tasker/TaskerBidScreen.js
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";
import { CustomText } from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext";
import { firebaseTaskService } from "../../services/firebaseTaskService";

const TaskerBidScreen = ({ navigation, route }) => {
  // Get job details passed from previous screen
  const { job } = route.params;
  const { user } = useAuth();

  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitBid = async () => {
    if (!bidAmount) {
      Alert.alert("Missing Information", "Please enter your bid amount.");
      return;
    }
    if (!user) {
      Alert.alert("Error", "You must be logged in to place a bid.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the bid data
      const bidData = {
        taskId: job.id,
        taskerId: user.uid,
        taskerName: user.displayName || `${user.firstName} ${user.lastName}`,
        taskerPhoto: user.photoURL || null,
        bidAmount: bidAmount, // You might want to format this (e.g., ensure it's a number string)
        message: message,
      };

      // Call the service to create the bid in Firestore
      await firebaseTaskService.createBid(bidData);

      setIsLoading(false);
      Alert.alert("Bid Placed!", "The client has been notified of your bid.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsLoading(false);
      console.error("Error placing bid:", error);
      Alert.alert("Error", "Could not place your bid. Please try again.");
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#f8fafc",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <CustomText type="h4" style={{ marginLeft: 16 }}>
          Place Your Bid
        </CustomText>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Job Summary Card */}
        <View style={[globalStyles.card, { marginBottom: 24 }]}>
          <CustomText type="heading" style={{ marginBottom: 4 }}>
            {job.title}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <View>
              <CustomText type="caption">Client's Budget</CustomText>
              <CustomText
                type="body"
                style={{ color: "#008080", fontWeight: "600" }}
              >
                {job.budget || job.price}
              </CustomText>
            </View>
            <View>
              <CustomText type="caption">Urgency</CustomText>
              <CustomText type="body" style={{ textTransform: "capitalize" }}>
                {job.urgency || "Normal"}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Bid Amount Input */}
        <View style={{ marginBottom: 24 }}>
          <CustomText style={globalStyles.inputLabel}>
            Your Bid Amount (NGN)
          </CustomText>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g., 5000"
            placeholderTextColor="#9CA3AF"
            value={bidAmount}
            onChangeText={setBidAmount}
            keyboardType="numeric"
          />
          <CustomText type="caption" style={{ marginTop: 4, color: "#6B7280" }}>
            Enter the amount you are willing to complete this task for.
          </CustomText>
        </View>

        {/* Message Input */}
        <View style={{ marginBottom: 24 }}>
          <CustomText style={globalStyles.inputLabel}>
            Message to Client (Optional)
          </CustomText>
          <TextInput
            style={[
              globalStyles.input,
              { height: 120, textAlignVertical: "top" },
            ]}
            placeholder="Introduce yourself, explain why you are the best fit, or ask a question..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleSubmitBid}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <CustomText style={globalStyles.buttonText}>Submit Bid</CustomText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskerBidScreen;
