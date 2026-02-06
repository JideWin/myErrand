// src/screens/shared/JobDetailsScreen.js
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";
import { CustomText } from "../../components/CustomText";

const JobDetailsScreen = ({ navigation, route }) => {
  // Use a more robust mock or default for 'job'
  const { job } = route.params || {
    job: {
      id: "mock_job_1", // Use a string ID to be closer to Firestore
      title: "House Cleaning (Default)",
      description:
        "Need someone to clean my 2-bedroom apartment. Includes dusting, vacuuming, and cleaning kitchen and bathrooms.",
      price: "$50",
      location: "123 Main Street, Apt 4B",
      duration: "2-3 hours",
      category: "Cleaning",
      posted: "2 hours ago",
      status: "pending",
      client: {
        uid: "mock_client_1", // Add a UID
        name: "Sarah Johnson",
        rating: 4.8,
        completedTasks: 24,
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
        return "#6366f1";
      case "accepted":
        return "#6366f1";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#f8fafc",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <CustomText type="h4">Job Details</CustomText>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Job Title and Price */}
          <View style={[globalStyles.card, { marginBottom: 16 }]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <CustomText type="h3" style={{ color: "#6366f1" }}>
                {job.price}
              </CustomText>
              <View
                style={{
                  backgroundColor:
                    getStatusColor(job.status || "pending") + "20",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <CustomText
                  style={{
                    color: getStatusColor(job.status || "pending"),
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {job.status ? job.status.replace("-", " ") : "Available"}
                </CustomText>
              </View>
            </View>
            <CustomText type="h3" style={{ marginBottom: 8 }}>
              {job.title}
            </CustomText>
            <CustomText type="body" color="gray600">
              {job.description}
            </CustomText>
          </View>

          {/* Job Details */}
          <View style={[globalStyles.card, { marginBottom: 16 }]}>
            <CustomText type="h4" style={{ marginBottom: 16 }}>
              Job Details
            </CustomText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="location-outline"
                size={20}
                color="#6366f1"
                style={{ marginRight: 12 }}
              />
              <View>
                <CustomText type="caption" color="gray500">
                  Location
                </CustomText>
                <CustomText type="body">{job.location}</CustomText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color="#6366f1"
                style={{ marginRight: 12 }}
              />
              <View>
                <CustomText type="caption" color="gray500">
                  Duration
                </CustomText>
                <CustomText type="body">{job.duration}</CustomText>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="pricetag-outline"
                size={20}
                color="#6366f1"
                style={{ marginRight: 12 }}
              />
              <View>
                <CustomText type="caption" color="gray500">
                  Category
                </CustomText>
                <CustomText type="body">{job.category}</CustomText>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#6366f1"
                style={{ marginRight: 12 }}
              />
              <View>
                <CustomText type="caption" color="gray500">
                  Posted
                </CustomText>
                <CustomText type="body">{job.posted}</CustomText>
              </View>
            </View>
          </View>

          {/* Client Information */}
          {job.client && (
            <View style={[globalStyles.card, { marginBottom: 16 }]}>
              <CustomText type="h4" style={{ marginBottom: 16 }}>
                Client Information
              </CustomText>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Image
                  source={{ uri: job.client.image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 12,
                  }}
                />
                <View>
                  <CustomText
                    type="body"
                    style={{ fontWeight: "600", marginBottom: 4 }}
                  >
                    {job.client.name}
                  </CustomText>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="star" size={16} color="#f59e0b" />
                    <CustomText
                      type="caption"
                      style={{ marginLeft: 4, color: "#6b7280" }}
                    >
                      {job.client.rating} • {job.client.completedTasks} tasks
                      completed
                    </CustomText>
                  </View>
                </View>
              </View>

              {/* *** THIS IS THE CRITICAL CHANGE ***
                We now pass the taskId (job.id) and the otherUser (job.client)
                to the ChatScreen.
              */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 12,
                }}
                onPress={() =>
                  navigation.navigate("Chat", {
                    otherUser: job.client,
                    taskId: job.id,
                  })
                }
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#6366f1"
                  style={{ marginRight: 8 }}
                />
                <CustomText style={{ color: "#6366f1", fontWeight: "600" }}>
                  Message Client
                </CustomText>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons (Logic to be added later) */}
          <View style={{ marginBottom: 24 }}>
            <TouchableOpacity
              style={[globalStyles.button, { marginBottom: 12 }]}
            >
              <CustomText style={globalStyles.buttonText}>
                Accept Job
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.buttonOutline}>
              <CustomText style={globalStyles.buttonOutlineText}>
                Save for Later
              </CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JobDetailsScreen;
