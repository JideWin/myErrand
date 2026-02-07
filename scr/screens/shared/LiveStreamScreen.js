// src/screens/shared/LiveStreamScreen.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import createAgoraRtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
} from "react-native-agora";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../styles/GlobalStyles";

// REPLACE WITH YOUR AGORA APP ID
const appId = "YOUR_AGORA_APP_ID";

const LiveStreamScreen = ({ navigation, route }) => {
  const { taskId, role } = route.params; // role: 'broadcaster' (Tasker) or 'audience' (Client)
  const agoraEngineRef = useRef(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      leave();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === "android") {
        await getPermission();
      }

      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.initialize({ appId: appId });
      agoraEngine.enableVideo();

      if (role === "broadcaster") {
        // Tasker settings: Better quality for transparency
        agoraEngine.setChannelProfile(
          ChannelProfileType.ChannelProfileLiveBroadcasting,
        );
        agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
        agoraEngine.startPreview();
      } else {
        // Client settings: Low latency for monitoring
        agoraEngine.setChannelProfile(
          ChannelProfileType.ChannelProfileLiveBroadcasting,
        );
        agoraEngine.setClientRole(ClientRoleType.ClientRoleAudience);
      }

      // Event Listeners
      agoraEngine.addListener("onUserJoined", (connection, uid) => {
        console.log("Remote user joined:", uid);
        setRemoteUid(uid);
      });

      agoraEngine.addListener("onUserOffline", (connection, uid) => {
        console.log("Remote user left:", uid);
        setRemoteUid(0);
        Alert.alert("Stream Ended", "The Tasker has stopped the live stream.");
        navigation.goBack();
      });

      agoraEngine.addListener("onJoinChannelSuccess", (connection, uid) => {
        console.log("Successfully joined channel:", uid);
        setIsJoined(true);
      });

      // Join the channel (Channel Name = taskId)
      join();
    } catch (e) {
      console.error(e);
    }
  };

  const join = async () => {
    try {
      // Use null for token (only for testing - use server token in production)
      agoraEngineRef.current?.joinChannel("", taskId, 0, {});
    } catch (e) {
      console.error(e);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMute = () => {
    agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  const getPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={leave} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {role === "broadcaster" ? "You are Live" : "Watching Tasker"}
        </Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* VIDEO VIEW */}
      <View style={styles.videoContainer}>
        {isJoined ? (
          <React.Fragment>
            {role === "broadcaster" ? (
              // Local View (Tasker)
              <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
            ) : // Remote View (Client)
            remoteUid !== 0 ? (
              <RtcSurfaceView
                canvas={{ uid: remoteUid }}
                style={styles.videoView}
              />
            ) : (
              <View style={styles.waitingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.waitingText}>
                  Waiting for Tasker to start stream...
                </Text>
              </View>
            )}
          </React.Fragment>
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
      </View>

      {/* CONTROLS (Only for Tasker) */}
      {role === "broadcaster" && (
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
      )}
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
    marginLeft: 15,
    flex: 1,
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
  waitingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  waitingText: { color: "#fff", marginTop: 10 },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  endBtn: { backgroundColor: "#ef4444" },
});

export default LiveStreamScreen;
