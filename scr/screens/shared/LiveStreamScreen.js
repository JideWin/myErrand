import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from "react-native-agora";
import { Ionicons } from "@expo/vector-icons";
// Ensure this path matches your project structure
import { colors } from "../../styles/GlobalStyles";

const appId = "7af54cf715bd47058c9216a7729f8b13"; // ✅Agora ID

const LiveStreamScreen = ({ navigation, route }) => {
  // Default to 'audience' if no params provided for safety
  const { taskId, role } = route.params || {
    taskId: "test_channel",
    role: "audience",
  };

  const agoraEngineRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0); // 0 = no remote user yet
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      leave();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      // 1. Request Permissions (Android)
      if (Platform.OS === "android") {
        await getPermission();
      }

      // 2. Create Engine
      agoraEngineRef.current = createAgoraRtcEngine();
      const engine = agoraEngineRef.current;

      engine.registerEventHandler({
        onJoinChannelSuccess: () => {
          setIsJoined(true);
          setIsLoading(false);
          console.log("Successfully joined the channel " + taskId);
        },
        onUserJoined: (_connection, uid) => {
          console.log("Remote user joined: " + uid);
          setRemoteUid(uid);
        },
        onUserOffline: (_connection, uid) => {
          console.log("Remote user left: " + uid);
          setRemoteUid(0);
        },
        onError: (err) => {
          console.error("Agora Error: ", err);
        },
      });

      engine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      engine.enableVideo();

      // 3. Set Role (Broadcaster = Tasker, Audience = Client)
      if (role === "broadcaster") {
        engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        await engine.startPreview();
      } else {
        engine.setClientRole(ClientRoleType.ClientRoleAudience);
      }

      // 4. Join Channel
      // Token is null for testing. In production, use a token server.
      engine.joinChannel("", taskId, 0, {});
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to start video stream.");
      setIsLoading(false);
    }
  };

  const getPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.release();
      setRemoteUid(0);
      setIsJoined(false);
      navigation.goBack();
    } catch (e) {
      console.error("Leave error:", e);
    }
  };

  const toggleMute = () => {
    const engine = agoraEngineRef.current;
    engine?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <View style={styles.waitingContainer}>
        <ActivityIndicator size="large" color="#008080" />
        <Text style={styles.waitingText}>Connecting to Secure Stream...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={leave} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {role === "broadcaster" ? "You are Live" : "Tasker Live View"}
        </Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Video View Area */}
      <View style={styles.videoContainer}>
        {/* If Broadcaster: Show Local View */}
        {role === "broadcaster" ? (
          <React.Fragment>
            <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
            {/* Controls for Tasker */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={toggleMute} style={styles.controlBtn}>
                <Ionicons
                  name={isMuted ? "mic-off" : "mic"}
                  size={28}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={leave}
                style={[styles.controlBtn, styles.endBtn]}
              >
                <Ionicons name="stop" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </React.Fragment>
        ) : // If Audience: Show Remote View
        remoteUid !== 0 ? (
          <RtcSurfaceView
            canvas={{ uid: remoteUid }}
            style={styles.videoView}
          />
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>
              Waiting for Tasker to start video...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  closeBtn: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  liveBadge: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  videoContainer: { flex: 1 },
  videoView: { flex: 1 },
  waitingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  waitingText: { color: "#fff", marginTop: 10 },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 15,
  },
  endBtn: {
    backgroundColor: "#ff4444",
  },
});

export default LiveStreamScreen;
