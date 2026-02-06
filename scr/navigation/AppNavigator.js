// src/navigation/AppNavigator.js (example)
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "../screens/shared/SettingsScreen";
import LanguageSelectionScreen from "../screens/shared/LanguageSelectionScreen"; // Import the new screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="LanguageSelectionScreen"
        component={LanguageSelectionScreen}
      />{" "}
      {/* Add the new screen */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
