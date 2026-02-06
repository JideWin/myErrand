// src/screens/client/ClientBidsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/GlobalStyles';
import { CustomText } from '../../components/CustomText';
import { firebaseTaskService } from '../../services/firebaseTaskService';

const ClientBidsScreen = ({ navigation, route }) => {
  const { taskId } = route.params;
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(null); // Tracks which bid is being accepted

  useEffect(() => {
    if (!taskId) {
      console.error("No Task ID provided to ClientBidsScreen");
      return;
    }

    const unsubscribe = firebaseTaskService.listenToBidsForTask(taskId, (newBids) => {
      setBids(newBids);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [taskId]);

  const handleAcceptBid = (bid) => {
    Alert.alert(
      "Accept Bid",
      `Are you sure you want to accept this bid of ${bid.bidAmount} from ${bid.taskerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          onPress: async () => {
            setIsAccepting(bid.id);
            try {
              await firebaseTaskService.acceptBid(taskId, bid);
              // On success, navigate back to the My Errands screen
              navigation.navigate("MyErrands");
            } catch (error) {
              console.error("Failed to accept bid:", error);
              Alert.alert("Error", "Could not accept the bid. Please try again.");
              setIsAccepting(null);
            }
          },
        },
      ]
    );
  };

  const renderBidItem = (bid) => (
    <View key={bid.id} style={[globalStyles.card, { marginBottom: 12 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <CustomText type="title" style={{ color: '#008080' }}>{bid.bidAmount}</CustomText>
          <CustomText type="body" style={{ fontWeight: '600', marginVertical: 4 }}>{bid.taskerName}</CustomText>
          <CustomText type="caption" color="gray600">{bid.message}</CustomText>
        </View>
        <View style={{ marginLeft: 16 }}>
          {isAccepting === bid.id ? (
            <ActivityIndicator color="#008080" />
          ) : (
            <TouchableOpacity
              style={[globalStyles.button, { paddingVertical: 12, paddingHorizontal: 20 }]}
              onPress={() => handleAcceptBid(bid)}
              disabled={isAccepting}
            >
              <CustomText style={globalStyles.buttonText}>Accept</CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f8fafc' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <CustomText type="h4" style={{ marginLeft: 16 }}>Bids for Task</CustomText>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#008080" style={{ marginTop: 40 }} />
        ) : bids.length === 0 ? (
          <View style={[globalStyles.card, { alignItems: 'center' }]}>
            <CustomText type="body" color="gray600">No bids have been placed on this task yet.</CustomText>
          </View>
        ) : (
          bids.map(renderBidItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClientBidsScreen;
