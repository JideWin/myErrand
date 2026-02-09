import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../context/AuthContext";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { CustomText } from "../../components/CustomText";
import Button from "../../components/Button";
import { colors, spacing, shadows } from "../../components/theme";

const CATEGORIES = [
  "Delivery",
  "Cleaning",
  "Shopping",
  "Repairs",
  "Pet Care",
  "Other",
];

const PostErrandScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Delivery");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !budget.trim() ||
      !location.trim()
    ) {
      Alert.alert(
        "Missing Info",
        "Please fill in all fields to post your errand.",
      );
      return;
    }

    if (isNaN(budget) || Number(budget) < 500) {
      Alert.alert("Invalid Budget", "Minimum budget is ₦500.");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        location: location.trim(),
        clientId: user.uid,
        clientName: user.displayName || "Client",
        status: "Open", // Initial status
        createdAt: new Date().toISOString(),
        bidsCount: 0,
      };

      await firebaseTaskService.createTask(taskData);

      Alert.alert("Success", "Your errand has been posted!", [
        { text: "OK", onPress: () => navigation.navigate("ClientHome") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Could not post errand. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <CustomText type="h2" color="primary" style={styles.header}>
          Post a New Errand
        </CustomText>

        <View style={styles.formGroup}>
          <CustomText type="caption" style={styles.label}>
            Errand Title
          </CustomText>
          <TextInput
            style={styles.input}
            placeholder="e.g., Pick up laundry at Ikeja"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        <View style={styles.formGroup}>
          <CustomText type="caption" style={styles.label}>
            Category
          </CustomText>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <CustomText
                  color={category === cat ? "white" : "gray500"}
                  type={category === cat ? "bold" : "body"}
                  style={{ fontSize: 12 }}
                >
                  {cat}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <CustomText type="caption" style={styles.label}>
            Description
          </CustomText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe exactly what needs to be done..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <CustomText type="caption" style={styles.label}>
              Budget (₦)
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="5000"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <CustomText type="caption" style={styles.label}>
              Location
            </CustomText>
            <TextInput
              style={styles.input}
              placeholder="Area or Address"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <Button
          title="Post Errand"
          onPress={handlePost}
          loading={loading}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  formGroup: { marginBottom: spacing.md },
  label: { marginBottom: 6, textTransform: "uppercase", fontSize: 11 },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: colors.gray800,
  },
  textArea: { minHeight: 100 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  row: { flexDirection: "row" },
  button: { marginTop: spacing.md },
});

export default PostErrandScreen;
