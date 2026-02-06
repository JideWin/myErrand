// src/screens/client/ClientHomeScreen.js
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";
import { CustomText } from "../../components/CustomText";
import { SafeAreaView } from 'react-native-safe-area-context';


const ClientHomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "cleaning", name: "Cleaning", icon: "home" },
    { id: "repairs", name: "Repairs", icon: "construct" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "delivery", name: "Delivery", icon: "bicycle" },
  ];

  const featuredTaskers = [
    {
      id: 1,
      name: "Belinah Mayowa",
      rating: 4.9,
      tasks: 124,
      category: "Cleaning",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Jide Godwin",
      rating: 4.8,
      tasks: 89,
      category: "Repairs",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      name: "Elianah Mayokun",
      rating: 4.7,
      tasks: 67,
      category: "Shopping",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "House Cleaning",
      status: "completed",
      date: "2 hours ago",
      price: "$50",
      tasker: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Grocery Shopping",
      status: "in-progress",
      date: "Yesterday",
      price: "$30",
      tasker: "Emily Davis",
    },
    {
      id: 3,
      title: "Furniture Assembly",
      status: "pending",
      date: "Oct 15",
      price: "$80",
      tasker: "Mike Chen",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10b981";
      case "in-progress":
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
            paddingHorizontal: 16,
            paddingVertical: 50,
            backgroundColor: "#000000",
          }}
        >
          <View>
            <CustomText type="caption" color="gray300">
              Welcome back
            </CustomText>
            <CustomText type="h3" color="white">
              Folakemi Abiodun
            </CustomText>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {/* Quick Actions */}
          <View style={{ marginBottom: 24 }}>
            <CustomText
              type="heading"
              style={{ marginBottom: 16, color: "#000000" }}
            >
              Get something done
            </CustomText>
            <TouchableOpacity
              style={[
                globalStyles.button,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={() => navigation.navigate("Post")}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <CustomText style={globalStyles.buttonText}>
                Post a New Errand
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <CustomText
              type="heading"
              style={{ marginBottom: 16, color: "#000000" }}
            >
              Categories
            </CustomText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={{
                    backgroundColor:
                      activeCategory === category.id ? "black" : "#000000",
                    padding: 12,
                    borderRadius: 12,
                    marginRight: 8,
                    alignItems: "center",
                    minWidth: 80,
                  }}
                  onPress={() => setActiveCategory(category.id)}
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

          {/* Featured Taskers */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <CustomText type="heading" style={{ color: "#000000" }}>
                Featured Taskers
              </CustomText>
              <TouchableOpacity>
                <CustomText type="caption" style={{ color: "teal" }}>
                  View All
                </CustomText>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredTaskers.map((tasker) => (
                <TouchableOpacity
                  key={tasker.id}
                  style={[
                    globalStyles.card,
                    { width: 160, marginRight: 12, backgroundColor: "#000000" },
                  ]}
                  onPress={() => navigation.navigate("JobDetails", { tasker })}
                >
                  <Image
                    source={{ uri: tasker.image }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginBottom: 12,
                      alignSelf: "center",
                    }}
                  />
                  <CustomText
                    type="heading"
                    style={{
                      textAlign: "center",
                      marginBottom: 4,
                      color: "#FFFFFF",
                    }}
                  >
                    {tasker.name}
                  </CustomText>
                  <CustomText
                    type="caption"
                    style={{
                      textAlign: "center",
                      marginBottom: 8,
                      color: "teal",
                    }}
                  >
                    {tasker.category}
                  </CustomText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <CustomText
                      type="caption"
                      style={{ marginLeft: 4, color: "#FFFFFF" }}
                    >
                      {tasker.rating} • {tasker.tasks} tasks
                    </CustomText>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "teal",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <CustomText
                      style={{
                        color: "#FFFFFF",
                        textAlign: "center",
                        fontSize: 12,
                      }}
                    >
                      Hire Now
                    </CustomText>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Recent Tasks */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <CustomText type="heading" style={{ color: "#000000" }}>
                Recent Tasks
              </CustomText>
              <TouchableOpacity
                onPress={() => navigation.navigate("MyErrands")}
              >
                <CustomText type="caption" style={{ color: "teal" }}>
                  View All
                </CustomText>
              </TouchableOpacity>
            </View>

            {recentTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  globalStyles.card,
                  { marginBottom: 12, backgroundColor: "#000000" },
                ]}
                onPress={() => navigation.navigate("JobDetails", { task })}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <CustomText
                    type="body"
                    style={{ fontWeight: "600", color: "#FFFFFF" }}
                  >
                    {task.title}
                  </CustomText>
                  <View
                    style={{
                      backgroundColor: getStatusColor(task.status),
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <CustomText
                      type="caption"
                      style={{ color: "#FFFFFF", textTransform: "capitalize" }}
                    >
                      {task.status}
                    </CustomText>
                  </View>
                </View>
                <CustomText
                  type="caption"
                  style={{ marginBottom: 8, color: "#FFFFFF" }}
                >
                  With {task.tasker}
                </CustomText>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CustomText type="caption" style={{ color: "#A9A9A9" }}>
                    {task.date}
                  </CustomText>
                  <CustomText
                    type="body"
                    style={{ color: "teal", fontWeight: "600" }}
                  >
                    {task.price}
                  </CustomText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClientHomeScreen;
