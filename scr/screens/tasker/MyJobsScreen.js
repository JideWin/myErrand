import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { useIsFocused } from "@react-navigation/native";
import Card from "../../components/Card";
import { CustomText } from "../../components/CustomText";
import { colors } from "../../components/theme";

const MyJobsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // 1. Define variable in scope
    let unsubscribe;

    const fetchJobs = () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // 2. Assign listener
        unsubscribe = firebaseTaskService.listenToTaskerJobs(
          user.uid,
          (fetchedJobs) => {
            setJobs(fetchedJobs);
            setIsLoading(false);
          },
        );
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchJobs();
    }

    // 3. Safe Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText type="h2">My Jobs</CustomText>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={jobs}
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
            <View style={styles.empty}>
              <CustomText align="center" color="gray500">
                You haven't accepted any jobs yet.
              </CustomText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { padding: 20, backgroundColor: colors.white },
  empty: { padding: 40, alignItems: "center" },
});

export default MyJobsScreen;
