// App.js
import "./scr/config/firebase";
import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Auth Context
import { AuthProvider, useAuth } from "./scr/context/AuthContext";

// Import all screens
import OnboardingScreen from "./scr/screens/OnboardingScreen";
import LoginScreen from "./scr/screens/LoginScreen";
import SignupScreen from "./scr/screens/SignupScreen";
import RoleSelectionScreen from "./scr/screens/RoleSelectionScreen";

// Import client screens
import ClientHomeScreen from "./scr/screens/clients/ClientHomeScreen";
import PostErrandScreen from "./scr/screens/clients/PostErrandScreen";
import MyErrandsScreen from "./scr/screens/clients/MyErrandsScreen";
import ClientProfileScreen from "./scr/screens/clients/ClientProfileScreen";
import ClientBidsScreen from "./scr/screens/clients/ClientBidsScreen";

// Import tasker screens
import TaskerHomeScreen from "./scr/screens/tasker/TaskerHomeScreen";
import AvailableJobsScreen from "./scr/screens/tasker/AvailableJobsScreen";
import MyJobsScreen from "./scr/screens/tasker/MyJobsScreen";
import TaskerProfileScreen from "./scr/screens/tasker/TaskerProfileScreen";
import TaskerBidScreen from "./scr/screens/tasker/TaskerBidScreen"; // Import new screen

// Import shared screens
import JobDetailsScreen from "./scr/screens/shared/JobDetailsScreen";
import ChatScreen from "./scr/screens/shared/ChatScreen";
import NotificationsScreen from "./scr/screens/shared/NotificationsScreen";
import SettingsScreen from "./scr/screens/shared/SettingsScreen";
import PaymentMethodsScreen from "./scr/screens/shared/PaymentMethodsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Light Theme
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

// Custom text component with font handling
const CustomText = ({ style, children, type = "body", ...props }) => {
  const getFontFamily = () => {
    switch (type) {
      case "title":
        return undefined;
      case "heading":
        return undefined;
      case "subtitle":
        return undefined;
      case "caption":
        return undefined;
      case "body":
      default:
        return undefined;
    }
  };

  const getFontWeight = () => {
    switch (type) {
      case "title":
        return "bold";
      case "heading":
        return "600";
      case "subtitle":
        return "500";
      case "caption":
        return "400";
      case "body":
      default:
        return "400";
    }
  };

  const getFontSize = () => {
    switch (type) {
      case "title":
        return 28;
      case "heading":
        return 20;
      case "subtitle":
        return 16;
      case "caption":
        return 14;
      case "body":
      default:
        return 16;
    }
  };

  return (
    <Text
      style={[
        {
          fontFamily: getFontFamily(),
          fontWeight: getFontWeight(),
          fontSize: getFontSize(),
          color: "#1f2937",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Placeholder component for screens that aren't implemented yet
function PlaceholderScreen({ route }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <CustomText style={{ fontSize: 24, marginBottom: 10 }}>
        {route.name} Screen
      </CustomText>
      <CustomText style={{ fontSize: 16, color: "#6b7280" }}>
        This screen is under development
      </CustomText>
    </View>
  );
}

// Client Tab Navigator
function ClientTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "MyErrands") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={ClientHomeScreen || PlaceholderScreen}
      />
      <Tab.Screen
        name="Post"
        component={PostErrandScreen || PlaceholderScreen}
      />
      <Tab.Screen
        name="MyErrands"
        component={MyErrandsScreen || PlaceholderScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ClientProfileScreen || PlaceholderScreen}
      />
    </Tab.Navigator>
  );
}

// Tasker Tab Navigator
function TaskerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Jobs") {
            iconName = focused ? "briefcase" : "briefcase-outline";
          } else if (route.name === "Available") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "MyJobs") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Jobs"
        component={TaskerHomeScreen || PlaceholderScreen}
      />
      <Tab.Screen
        name="Available"
        component={AvailableJobsScreen || PlaceholderScreen}
      />
      <Tab.Screen name="MyJobs" component={MyJobsScreen || PlaceholderScreen} />
      <Tab.Screen
        name="Profile"
        component={TaskerProfileScreen || PlaceholderScreen}
      />
    </Tab.Navigator>
  );
}

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
        setFontsLoaded(true);
      } catch (error) {
        console.log("Custom fonts not found, using system fonts");
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Using ActivityIndicator instead of Text for a cleaner loading state */}
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <NavigationContainer theme={ErrandLightTheme}>
            <Stack.Navigator
              initialRouteName="Onboarding"
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
                cardStyle: { backgroundColor: "#ffffff" },
                headerStyle: {
                  backgroundColor: "#f8fafc",
                  shadowColor: "transparent",
                },
                headerTintColor: "#1f2937",
              }}
            >
              {/* Your stack screens go here */}
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen || PlaceholderScreen}
              />
              <Stack.Screen
                name="RoleSelection"
                component={RoleSelectionScreen || PlaceholderScreen}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen || PlaceholderScreen}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen || PlaceholderScreen}
              />
              <Stack.Screen name="ClientMain" component={ClientTabNavigator} />
              <Stack.Screen name="TaskerMain" component={TaskerTabNavigator} />
              <Stack.Screen
                name="ClientBids"
                component={ClientBidsScreen}
                options={{
                  headerShown: false, // Using custom header inside the screen
                }}
              />
              <Stack.Screen
                name="TaskerBid"
                component={TaskerBidScreen}
                options={{
                  headerShown: false, // Using custom header inside the screen
                }}
              />
              <Stack.Screen
                name="JobDetails"
                component={JobDetailsScreen || PlaceholderScreen}
                options={{
                  headerShown: false, // Using custom header inside screen
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen || PlaceholderScreen}
                options={{
                  headerShown: false, // Using custom header inside screen
                }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen || PlaceholderScreen}
                options={{
                  headerShown: false, // Using custom header inside screen
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen || PlaceholderScreen}
                options={{
                  headerShown: false, // Using custom header inside screen
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
