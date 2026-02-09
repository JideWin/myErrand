import "./scr/config/firebase";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { LogBox } from "react-native";

// --- IMPORTS ---
// We use 'try/catch' logic by using defaults if imports fail
import { AuthProvider, useAuth } from "./scr/context/AuthContext";

import OnboardingScreen from "./scr/screens/OnboardingScreen";
import LoginScreen from "./scr/screens/LoginScreen";
import SignupScreen from "./scr/screens/SignupScreen";
import RoleSelectionScreen from "./scr/screens/RoleSelectionScreen";

// Placeholder for missing screens to prevent "undefined" crash
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

// Import other screens (These might be undefined if files are empty)
import ClientHomeScreen from "./scr/screens/clients/ClientHomeScreen";
import PostErrandScreen from "./scr/screens/clients/PostErrandScreen";
import MyErrandsScreen from "./scr/screens/clients/MyErrandsScreen";
import ClientProfileScreen from "./scr/screens/clients/ClientProfileScreen";
import ClientBidsScreen from "./scr/screens/clients/ClientBidsScreen";
import TaskerHomeScreen from "./scr/screens/tasker/TaskerHomeScreen";
import AvailableJobsScreen from "./scr/screens/tasker/AvailableJobsScreen";
import MyJobsScreen from "./scr/screens/tasker/MyJobsScreen";
import TaskerProfileScreen from "./scr/screens/tasker/TaskerProfileScreen";
import TaskerBidScreen from "./scr/screens/tasker/TaskerBidScreen";
import JobDetailsScreen from "./scr/screens/shared/JobDetailsScreen";
import ChatScreen from "./scr/screens/shared/ChatScreen";
import NotificationsScreen from "./scr/screens/shared/NotificationsScreen";
import SettingsScreen from "./scr/screens/shared/SettingsScreen";
import PaymentMethodsScreen from "./scr/screens/shared/PaymentMethodsScreen";

LogBox.ignoreLogs(["AsyncStorage has been extracted", "The action 'REPLACE'"]);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ErrandLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6366f1",
    background: "#ffffff",
    card: "#f8fafc",
    text: "#1f2937",
    border: "#e5e7eb",
    notification: "#6366f1",
  },
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
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#6b7280",
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
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#6b7280",
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

// --- ROOT NAVIGATOR ---
const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#ffffff" },
      }}
    >
      {!user ? (
        // Auth Stack
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
        // App Stack
        <>
          {user.role === "tasker" ? (
            <Stack.Screen name="TaskerMain" component={TaskerTabNavigator} />
          ) : (
            <Stack.Screen name="ClientMain" component={ClientTabNavigator} />
          )}
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
            name="PaymentMethods"
            component={SafeScreen(PaymentMethodsScreen, "PaymentMethods")}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

// --- APP ENTRY POINT ---
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
          "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
          "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
          "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
        });
      } catch (e) {} // Ignore font errors
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  // SAFETY CHECK: Ensure AuthProvider exists before rendering
  if (!AuthProvider) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", textAlign: "center", padding: 20 }}>
          CRITICAL ERROR: AuthProvider is undefined.{"\n"}
          Check scr/context/AuthContext.js exports.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={ErrandLightTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
