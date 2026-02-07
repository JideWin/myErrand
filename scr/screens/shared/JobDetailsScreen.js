// OPEN: src/screens/shared/JobDetailsScreen.js

// 1. ADD IMPORTS
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Ensure correct path

// ... inside the component ...

const JobDetailsScreen = ({ navigation, route }) => {
  // 2. GET USER CONTEXT
  const { user } = useContext(AuthContext);

  // (Existing params logic...)
  const { job } = route.params || {};

  // 3. ADD THIS FUNCTION FOR NAVIGATION
  const handleLiveStream = () => {
    const isTasker = user?.uid === job.assignedTaskerId; // OR however you identify the tasker
    const role = isTasker ? "broadcaster" : "audience";

    navigation.navigate("LiveStream", {
      taskId: job.id,
      role: role,
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* ... Existing UI ... */}

      {/* 4. ADD THE BUTTON (Ideally above the 'Cancel' or 'Complete' buttons) */}

      {job.status === "in-progress" && (
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={handleLiveStream}
            style={{
              backgroundColor: "#ef4444", // Red for LIVE
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Ionicons
              name="videocam"
              size={24}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <CustomText style={{ color: "#fff", fontWeight: "bold" }}>
              {user?.uid === job.assignedTaskerId
                ? "Start Live Stream"
                : "Watch Tasker Live"}
            </CustomText>
          </TouchableOpacity>
        </View>
      )}

      {/* ... Rest of UI ... */}
    </SafeAreaView>
  );
};
