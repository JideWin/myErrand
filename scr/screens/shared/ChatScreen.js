// src/screens/shared/ChatScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";
import { CustomText } from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import {
  listenToMessages,
  sendMessage,
} from "../../services/firebaseChatService"; // Import chat service
import { serverTimestamp } from "firebase/firestore";

const ChatScreen = ({ navigation, route }) => {
  // Get the current user from AuthContext
  const { user: currentUser } = useAuth();

  // Get navigation params. We now require otherUser and taskId.
  const { otherUser, taskId } = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Set up the real-time message listener
  useEffect(() => {
    if (!taskId) {
      console.error("No taskId provided to ChatScreen");
      return;
    }

    // listenToMessages returns the unsubscribe function
    const unsubscribe = listenToMessages(taskId, (newMessages) => {
      // Format messages for the FlatList, handling null timestamps
      const formattedMessages = newMessages.map((msg) => ({
        ...msg,
        time: msg.createdAt
          ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Sending...",
      }));
      setMessages(formattedMessages);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [taskId]); // Re-run effect if taskId changes

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser && taskId) {
      const messageData = {
        text: newMessage,
        senderId: currentUser.uid,
        senderName:
          currentUser.displayName ||
          `${currentUser.firstName} ${currentUser.lastName}`,
        senderPhoto: currentUser.photoURL || null,
        // createdAt is added by the service using serverTimestamp
      };

      try {
        setNewMessage(""); // Clear input immediately
        await sendMessage(taskId, messageData);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally, re-set the new message text to allow user to try again
        setNewMessage(newMessage);
      }
    }
  };

  const renderMessage = ({ item }) => {
    // Check if the message was sent by the current user
    const isMyMessage = item.senderId === currentUser.uid;

    return (
      <View
        style={[
          {
            maxWidth: "80%",
            padding: 12,
            borderRadius: 18,
            marginBottom: 12,
            alignSelf: isMyMessage ? "flex-end" : "flex-start",
          },
          isMyMessage
            ? { backgroundColor: "#6366f1", borderBottomRightRadius: 4 } // My message
            : { backgroundColor: "#f3f4f6", borderBottomLeftRadius: 4 }, // Other user's message
        ]}
      >
        <CustomText
          style={{
            color: isMyMessage ? "#ffffff" : "#374151",
            marginBottom: 4,
          }}
        >
          {item.text}
        </CustomText>
        <CustomText
          style={{
            fontSize: 12,
            color: isMyMessage ? "#e0e7ff" : "#9ca3af",
            textAlign: "right",
          }}
        >
          {item.time}
        </CustomText>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header - Now uses otherUser prop */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#f8fafc",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#374151"
                style={{ marginRight: 12 }}
              />
            </TouchableOpacity>
            {otherUser?.image ? (
              <Image
                source={{ uri: otherUser.image }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                  backgroundColor: "#e5e7eb",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={24} color="#9ca3af" />
              </View>
            )}
            <View>
              <CustomText type="body" style={{ fontWeight: "600" }}>
                {otherUser?.name || "Errand User"}
              </CustomText>
              {/* 'online' status can be a future feature from Firestore presence */}
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          inverted={false} // Keep as false if using `flex-end` or similar, or set to true for typical chat
        />

        {/* Message Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          }}
        >
          <TextInput
            style={[
              globalStyles.input,
              {
                flex: 1,
                marginRight: 12,
                marginBottom: 0,
                backgroundColor: "#f9fafb",
              },
            ]}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#6366f1",
              padding: 12,
              borderRadius: 12,
              opacity: newMessage.trim() ? 1 : 0.5,
            }}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
