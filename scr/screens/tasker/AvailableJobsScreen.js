import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import Card from "../../components/Card";
import { CustomText } from "../../components/CustomText";
import { colors } from "../../components/theme";

const AvailableJobsScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Define 'unsubscribe' here so it's available for cleanup
    let unsubscribe;

    const startListener = () => {
      try {
        // 2. Assign the listener
        unsubscribe = firebaseTaskService.listenToAvailableTasks((data) => {
          setTasks(data);
          setLoading(false);
        });
      } catch (e) {
        console.error("Listener Error:", e);
        setLoading(false);
      }
    };

    startListener();

    // 3. Safe Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText type="h2">Available Errands</CustomText>
        <CustomText color="gray500">Find work near you</CustomText>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subtitle={item.description}
              price={item.budget || item.amount}
              status={item.status}
              onPress={() => navigation.navigate("JobDetails", { job: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <CustomText align="center" color="gray500">
                No errands available right now.
              </CustomText>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { padding: 20, backgroundColor: colors.white, marginBottom: 10 },
  emptyState: { marginTop: 50, padding: 20 },
});

export default AvailableJobsScreen;
