import React, { useContext, useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";

// --- IMPORTS ---
import { AuthContext } from "../context/AuthContext";
import { colors } from "../components/theme";

// Auth Screens
import OnboardingScreen from "../screens/OnboardingScreen";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

// Client Screens
import ClientHomeScreen from "../screens/clients/ClientHomeScreen";
import PostErrandScreen from "../screens/clients/PostErrandScreen";
import MyErrandsScreen from "../screens/clients/MyErrandsScreen";
import ClientProfileScreen from "../screens/clients/ClientProfileScreen";
import ClientBidsScreen from "../screens/clients/ClientBidsScreen";
import PaymentScreen from "../screens/clients/PaymentScreen"; // The Checkout Screen

// Tasker Screens
import TaskerHomeScreen from "../screens/tasker/TaskerHomeScreen";
import AvailableJobsScreen from "../screens/tasker/AvailableJobsScreen";
import MyJobsScreen from "../screens/tasker/MyJobsScreen";
import TaskerProfileScreen from "../screens/tasker/TaskerProfileScreen";
import TaskerBidScreen from "../screens/tasker/TaskerBidScreen";
import ServicesScreen from "../screens/tasker/ServicesScreen";

// Shared Screens
import JobDetailsScreen from "../screens/shared/JobDetailsScreen";
import ChatScreen from "../screens/shared/ChatScreen";
import NotificationsScreen from "../screens/shared/NotificationsScreen";
import SettingsScreen from "../screens/shared/SettingsScreen";

// FIX: Importing the correct singular name based on your file
import PaymentMethodScreen from "../screens/shared/PaymentMethodScreen";

// Ignore irrelevant warnings
LogBox.ignoreLogs(["AsyncStorage has been extracted", "The action 'REPLACE'"]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- SAFETY WRAPPER ---
const SafeScreen = (Component, name) => {
  return (
    Component ||
    (() => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Missing Component: {name}</Text>
      </View>
    ))
  );
};

// --- CLIENT TABS ---
function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";
          if (route.name === "Home")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Post")
            iconName = focused ? "add-circle" : "add-circle-outline";
          else if (route.name === "MyErrands")
            iconName = focused ? "list" : "list-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={SafeScreen(ClientHomeScreen, "ClientHome")}
      />
      <Tab.Screen
        name="Post"
        component={SafeScreen(PostErrandScreen, "PostErrand")}
      />
      <Tab.Screen
        name="MyErrands"
        component={SafeScreen(MyErrandsScreen, "MyErrands")}
      />
      <Tab.Screen
        name="Profile"
        component={SafeScreen(ClientProfileScreen, "ClientProfile")}
      />
    </Tab.Navigator>
  );
}

// --- TASKER TABS ---
function TaskerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "help";
          if (route.name === "Jobs")
            iconName = focused ? "briefcase" : "briefcase-outline";
          else if (route.name === "Available")
            iconName = focused ? "search" : "search-outline";
          else if (route.name === "MyJobs")
            iconName = focused ? "list" : "list-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray500,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Jobs"
        component={SafeScreen(TaskerHomeScreen, "TaskerHome")}
      />
      <Tab.Screen
        name="Available"
        component={SafeScreen(AvailableJobsScreen, "AvailableJobs")}
      />
      <Tab.Screen
        name="MyJobs"
        component={SafeScreen(MyJobsScreen, "MyJobs")}
      />
      <Tab.Screen
        name="Profile"
        component={SafeScreen(TaskerProfileScreen, "TaskerProfile")}
      />
    </Tab.Navigator>
  );
}

// --- MAIN NAVIGATOR ---
const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.white },
      }}
    >
      {!user ? (
        // === AUTH STACK ===
        <>
          <Stack.Screen
            name="Onboarding"
            component={SafeScreen(OnboardingScreen, "Onboarding")}
          />
          <Stack.Screen
            name="RoleSelection"
            component={SafeScreen(RoleSelectionScreen, "RoleSelection")}
          />
          <Stack.Screen
            name="Signup"
            component={SafeScreen(SignupScreen, "Signup")}
          />
          <Stack.Screen
            name="Login"
            component={SafeScreen(LoginScreen, "Login")}
          />
        </>
      ) : (
        // === APP STACK ===
        <>
          {/* Main Dashboard based on Role */}
          {user.role === "tasker" ? (
            <Stack.Screen name="TaskerMain" component={TaskerTabNavigator} />
          ) : (
            <Stack.Screen name="ClientMain" component={ClientTabNavigator} />
          )}

          {/* Shared Screens */}
          <Stack.Screen
            name="JobDetails"
            component={SafeScreen(JobDetailsScreen, "JobDetails")}
          />
          <Stack.Screen
            name="Chat"
            component={SafeScreen(ChatScreen, "Chat")}
          />
          <Stack.Screen
            name="ClientBids"
            component={SafeScreen(ClientBidsScreen, "ClientBids")}
          />
          <Stack.Screen
            name="TaskerBid"
            component={SafeScreen(TaskerBidScreen, "TaskerBid")}
          />
          <Stack.Screen
            name="Notifications"
            component={SafeScreen(NotificationsScreen, "Notifications")}
          />
          <Stack.Screen
            name="Settings"
            component={SafeScreen(SettingsScreen, "Settings")}
          />
          <Stack.Screen
            name="Services"
            component={SafeScreen(ServicesScreen, "Services")}
          />

          {/* Settings Screen: "Add a card" */}
          <Stack.Screen
            name="PaymentMethod"
            component={SafeScreen(PaymentMethodScreen, "PaymentMethod")}
          />

          {/* Checkout Screen: "Pay for a Job" */}
          <Stack.Screen
            name="Payment"
            component={SafeScreen(PaymentScreen, "Payment")}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
