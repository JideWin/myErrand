import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import { CustomText } from "../../components/CustomText";
import { colors, spacing, shadows } from "../../components/theme";
import Icon from "../../components/Icon";

const ChatScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const params = route.params || {};

  // FIX: Handle whatever name the previous screen used (chatId, jobId, or taskId)
  const currentJobId = params.chatId || params.jobId || params.taskId;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef();

  useEffect(() => {
    if (!currentJobId) {
      console.error("Chat Error: No Job ID provided");
      setLoading(false);
      return;
    }

    // Query messages for THIS specific job
    const q = query(
      collection(db, "chats"),
      where("taskId", "==", currentJobId),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setLoading(false);

      // Scroll to bottom on new message
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [currentJobId]);

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const textToSend = inputText.trim();
    setInputText(""); // Clear input immediately for better UX

    try {
      // FIX: Ensure 'taskId' is explicitly defined here
      await addDoc(collection(db, "chats"), {
        taskId: currentJobId,
        text: textToSend,
        senderId: user.uid,
        senderName: user.displayName || "User",
        createdAt: serverTimestamp(),
        // Optional: Add read status
        readBy: [user.uid],
      });
    } catch (error) {
      console.error("Send error:", error);
      alert("Failed to send message: " + error.message);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === user.uid;
    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMe && (
          <CustomText
            type="caption"
            color="gray500"
            style={{ marginBottom: 2 }}
          >
            {item.senderName}
          </CustomText>
        )}
        <CustomText color={isMe ? "white" : "gray800"}>{item.text}</CustomText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 5 }}
        >
          <Icon name="arrow-back" size={24} color={colors.gray800} />
        </TouchableOpacity>
        <View style={{ marginLeft: 10 }}>
          <CustomText type="h3">Chat</CustomText>
          <CustomText type="caption" color="gray500">
            Job ID: {currentJobId ? currentJobId.slice(0, 6) : "..."}
          </CustomText>
        </View>
      </View>

      {/* Messages List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={colors.gray400}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && { backgroundColor: colors.gray300 },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    ...shadows.small,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  theirMessage: {
    backgroundColor: colors.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.gray200,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.gray200,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray50,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatScreen;
