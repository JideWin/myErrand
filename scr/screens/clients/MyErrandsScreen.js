import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { useIsFocused } from "@react-navigation/native";
import Card from "../../components/Card";
import { colors } from "../../components/theme";
import { CustomText } from "../../components/CustomText";

const MyErrandsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    // 1. Define variable HERE
    let unsubscribe;

    const fetchTasks = () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // 2. Assign listener
        unsubscribe = firebaseTaskService.listenToClientTasks(
          user.uid,
          (allTasks) => {
            setTasks(allTasks);
            setIsLoading(false);
          },
        );
      } catch (error) {
        console.error("Error listening to tasks:", error);
        setIsLoading(false);
      }
    };

    if (isFocused) {
      fetchTasks();
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
        <CustomText type="h2">My Errands</CustomText>
      </View>

      {isLoading ? (
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
              price={item.budget || 0}
              status={item.status}
              onPress={() => navigation.navigate("JobDetails", { job: item })}
            />
          )}
          ListEmptyComponent={
            <CustomText
              align="center"
              style={{ marginTop: 50, color: colors.gray500 }}
            >
              You haven't posted any errands yet.
            </CustomText>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: { padding: 20, backgroundColor: colors.white },
});

export default MyErrandsScreen;
