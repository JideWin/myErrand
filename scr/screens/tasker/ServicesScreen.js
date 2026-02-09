import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { CustomText } from "../../components/CustomText";
import { colors, spacing } from "../../components/theme";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const AVAILABLE_SERVICES = [
  { id: "cleaning", label: "Home Cleaning", icon: "sparkles-outline" },
  { id: "delivery", label: "Delivery & Errands", icon: "bicycle-outline" },
  { id: "moving", label: "Moving Help", icon: "cube-outline" },
  { id: "plumbing", label: "Plumbing Help", icon: "water-outline" },
  { id: "electrical", label: "Electrical Help", icon: "flash-outline" },
  { id: "shopping", label: "Grocery Shopping", icon: "cart-outline" },
];

const ServicesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing services
  useEffect(() => {
    const fetchServices = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().services) {
          setSelectedServices(docSnap.data().services);
        }
      }
    };
    fetchServices();
  }, [user]);

  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        services: selectedServices,
      });
      Alert.alert("Success", "Your skills have been updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Could not save services. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <CustomText type="h3" style={{ marginLeft: 15 }}>
          My Skills
        </CustomText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <CustomText color="gray500" style={{ marginBottom: spacing.lg }}>
          Select the services you want to offer to clients.
        </CustomText>

        {AVAILABLE_SERVICES.map((item) => {
          const isSelected = selectedServices.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.optionCard, isSelected && styles.optionSelected]}
              onPress={() => toggleService(item.id)}
            >
              <View style={styles.optionRow}>
                <View
                  style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
                >
                  <Icon
                    name={item.icon}
                    size={24}
                    color={isSelected ? colors.white : colors.gray500}
                  />
                </View>
                <CustomText type="h4" style={{ flex: 1, marginLeft: 15 }}>
                  {item.label}
                </CustomText>
                <Icon
                  name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={isSelected ? colors.primary : colors.gray300}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.gray100,
  },
  content: { padding: spacing.lg },
  optionCard: {
    padding: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  optionSelected: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  optionRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray200,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxSelected: {
    backgroundColor: colors.primary,
  },
});

export default ServicesScreen;
