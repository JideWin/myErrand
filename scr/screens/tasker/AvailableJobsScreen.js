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
    // 1. Define variable HERE in the main scope
    let unsubscribe;

    const startListener = () => {
      try {
        // 2. Assign the listener to the variable
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

    // 3. Cleanup is safe because 'unsubscribe' is in scope
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
            <CustomText
              align="center"
              style={{ marginTop: 50, color: colors.gray500 }}
            >
              No errands available right now.
            </CustomText>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { padding: 20, backgroundColor: colors.white },
});

export default AvailableJobsScreen;
