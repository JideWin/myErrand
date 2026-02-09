import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";
// REMOVED: import { formatDistanceToNow } from "date-fns";

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePress = async (item) => {
    if (!item.read) {
      const ref = doc(db, "notifications", item.id);
      updateDoc(ref, { read: true });
    }

    if (item.type === "BID_RECEIVED") {
      navigation.navigate("ClientBids", { taskId: item.relatedId });
    } else if (item.type === "JOB_ASSIGNED") {
      navigation.navigate("JobDetails", { job: { id: item.relatedId } });
    } else if (item.type === "JOB_COMPLETED") {
      navigation.navigate("MyErrands");
    }
  };

  // Custom Time Formatter (No External Package Needed)
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";

    // Handle Firestore Timestamp or JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.read;
    const bg = isUnread ? colors.primary + "10" : colors.white;

    let iconName = "notifications";
    let iconColor = colors.primary;
    if (item.type === "BID_RECEIVED") {
      iconName = "pricetag";
      iconColor = colors.accent;
    }
    if (item.type === "JOB_ASSIGNED") {
      iconName = "briefcase";
      iconColor = "#10B981";
    }
    if (item.type === "ALERT") {
      iconName = "alert-circle";
      iconColor = colors.error;
    }

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bg }, shadows.small]}
        onPress={() => handlePress(item)}
      >
        <View style={styles.iconBox}>
          <Icon name={iconName} size={24} color={iconColor} />
          {isUnread && <View style={styles.dot} />}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <CustomText type="h4" style={styles.title}>
            {item.title}
          </CustomText>
          <CustomText color="gray600" numberOfLines={2} style={styles.body}>
            {item.body}
          </CustomText>
          <CustomText type="caption" color="gray400" style={{ marginTop: 4 }}>
            {getTimeAgo(item.createdAt)}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <CustomText type="h3" style={{ marginLeft: 15 }}>
          Notifications
        </CustomText>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.center}>
          <Icon
            name="notifications-off-outline"
            size={60}
            color={colors.gray300}
          />
          <CustomText color="gray400" style={{ marginTop: 20 }}>
            No notifications yet.
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  iconBox: { position: "relative" },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.white,
  },
  title: { marginBottom: 2 },
  body: { fontSize: 14 },
});

export default NotificationsScreen;
