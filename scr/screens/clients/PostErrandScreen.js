// src/screens/client/PostErrandScreen.js
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";
import { CustomText } from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { firebaseTaskService } from "../../services/firebaseTaskService"; // Import task service

const PostErrandScreen = ({ navigation }) => {
  const { user } = useAuth(); // Get the current user
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
    urgency: "normal",
  });

  const categories = [
    { id: "cleaning", name: "Cleaning", icon: "home" },
    { id: "repairs", name: "Repairs", icon: "construct" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "delivery", name: "Delivery", icon: "bicycle" },
    { id: "moving", name: "Moving", icon: "car" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal" },
  ];

  const urgencyLevels = [
    { id: "low", name: "Low", color: "#10b981" },
    { id: "normal", name: "Normal", color: "#f59e0b" }, // Changed yellow to amber for readability
    { id: "high", name: "High", color: "#ef4444" },
  ];

  const updateFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handlePostErrand = async () => {
    if (!user) {
      console.error("No user found. Cannot post errand.");
      // Optionally, show an alert to the user
      return;
    }

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.budget ||
      !formData.location
    ) {
      // Optionally, show an alert
      console.warn("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const taskData = {
        ...formData,
        clientId: user.uid,
        clientName: `${user.firstName} ${user.lastName}`,
        clientPhoto: user.photoURL || null,
        // 'createdAt' and 'status' will be set by the service
      };

      await firebaseTaskService.createTask(taskData);

      setIsLoading(false);
      // Navigate to My Errands screen after successful post
      navigation.navigate("MyErrands");
    } catch (error) {
      setIsLoading(false);
      console.error("Error posting errand:", error);
      // Optionally, show an alert to the user
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
            paddingHorizontal: 16,
            paddingTop: 40, // More top padding
            paddingBottom: 24,
            backgroundColor: "#000000",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <CustomText type="h4" style={{ color: "#FFFFFF" }}>
            Post New Errand
          </CustomText>
          <TouchableOpacity onPress={handlePostErrand} disabled={isLoading}>
            <CustomText style={{ color: "lightgray", fontWeight: "600" }}>
              Post
            </CustomText>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {/* Title */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              What do you need done?
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="e.g., House cleaning, Grocery shopping"
              placeholderTextColor="#737373"
              value={formData.title}
              onChangeText={(text) => updateFormData("title", text)}
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              Description
            </CustomText>
            <TextInput
              style={[
                globalStyles.input,
                { height: 120, textAlignVertical: "top" },
              ]}
              placeholder="Describe what you need in detail..."
              placeholderTextColor="#737373"
              value={formData.description}
              onChangeText={(text) => updateFormData("description", text)}
              multiline
            />
          </View>

          {/* Category */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              Category
            </CustomText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 8 }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={{
                    backgroundColor:
                      formData.category === category.id ? "teal" : "#000000",
                    padding: 12,
                    borderRadius: 12,
                    marginRight: 8,
                    alignItems: "center",
                    minWidth: 100,
                  }}
                  onPress={() => updateFormData("category", category.id)}
                >
                  <Ionicons name={category.icon} size={20} color="#FFFFFF" />
                  <CustomText
                    type="caption"
                    style={{ marginTop: 4, color: "#FFFFFF" }}
                  >
                    {category.name}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Budget */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              Budget (NGN)
            </CustomText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={[globalStyles.input, { flex: 1 }]}
                placeholder="Enter your budget"
                placeholderTextColor="#737373"
                value={formData.budget}
                onChangeText={(text) => updateFormData("budget", text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Location */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              Location
            </CustomText>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter your address"
              placeholderTextColor="#737373"
              value={formData.location}
              onChangeText={(text) => updateFormData("location", text)}
            />
          </View>

          {/* Urgency */}
          <View style={{ marginBottom: 24 }}>
            <CustomText style={[globalStyles.inputLabel, { color: "#000000" }]}>
              Urgency
            </CustomText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={{
                    backgroundColor:
                      formData.urgency === level.id
                        ? level.color + "20"
                        : "#000000",
                    borderWidth: 2,
                    borderColor:
                      formData.urgency === level.id
                        ? level.color
                        : "transparent",
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    flex: 1,
                    marginHorizontal: 4,
                  }}
                  onPress={() => updateFormData("urgency", level.id)}
                >
                  <CustomText
                    style={{
                      color:
                        formData.urgency === level.id ? level.color : "#FFFFFF",
                    }}
                  >
                    {level.name}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Post Button */}
          <TouchableOpacity
            style={globalStyles.button}
            onPress={handlePostErrand}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <CustomText style={globalStyles.buttonText}>
                Post Errand
              </CustomText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PostErrandScreen;
