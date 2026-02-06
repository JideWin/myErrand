// src/screens/tasker/TaskerHomeScreen.js
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/GlobalStyles';
import { CustomText } from '../../components/CustomText';

const TaskerHomeScreen = ({ navigation }) => {
  const [stats] = useState({
    completedJobs: 24,
    totalEarnings: 1240,
    rating: 4.9,
    responseRate: 98,
  });

  const availableJobs = [
    {
      id: 1,
      title: 'House Cleaning',
      description: 'Need someone to clean my 2-bedroom apartment',
      price: '$50',
      distance: '1.2 mi',
      time: '2 hours ago',
      category: 'Cleaning',
    },
    {
      id: 2,
      title: 'Grocery Shopping',
      description: 'Need someone to buy groceries from Walmart',
      price: '$30',
      distance: '0.8 mi',
      time: '1 hour ago',
      category: 'Shopping',
    },
    {
      id: 3,
      title: 'Furniture Assembly',
      description: 'Need help assembling IKEA furniture',
      price: '$80',
      distance: '2.1 mi',
      time: '3 hours ago',
      category: 'Repairs',
    },
  ];

  const myJobs = [
    {
      id: 1,
      title: 'Office Cleaning',
      status: 'in-progress',
      client: 'TechCorp Inc.',
      price: '$120',
      time: 'Starts in 2 hours',
    },
    {
      id: 2,
      title: 'Package Delivery',
      status: 'scheduled',
      client: 'John Smith',
      price: '$25',
      time: 'Tomorrow, 10:00 AM',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#6366f1';
      case 'scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#171717' }}>
          <View>
            <CustomText type="caption" style={{ color: '#a3a3a3' }}>Welcome back</CustomText>
            <CustomText type="heading">Jane Tasker</CustomText>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#f8fafc" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Stats Overview */}
          <View style={[globalStyles.card, { marginBottom: 24 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <CustomText type="title" style={{ color: '#6366f1' }}>{stats.completedJobs}</CustomText>
                <CustomText type="caption">Jobs Done</CustomText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CustomText type="title" style={{ color: '#10b981' }}>${stats.totalEarnings}</CustomText>
                <CustomText type="caption">Earned</CustomText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CustomText type="title" style={{ color: '#f59e0b' }}>{stats.rating}</CustomText>
                <CustomText type="caption">Rating</CustomText>
              </View>
              <View style={{ alignItems: 'center' }}>
                <CustomText type="title" style={{ color: '#6366f1' }}>{stats.responseRate}%</CustomText>
                <CustomText type="caption">Response</CustomText>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[globalStyles.button, { marginBottom: 12 }]}
              onPress={() => navigation.navigate('Available')}
            >
              <CustomText style={globalStyles.buttonText}>Find Available Jobs</CustomText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={globalStyles.buttonOutline}
              onPress={() => navigation.navigate('MyJobs')}
            >
              <CustomText style={globalStyles.buttonOutlineText}>View My Jobs</CustomText>
            </TouchableOpacity>
          </View>

          {/* Available Jobs */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <CustomText type="heading">Available Jobs</CustomText>
              <TouchableOpacity onPress={() => navigation.navigate('Available')}>
                <CustomText type="caption" style={{ color: '#6366f1' }}>View All</CustomText>
              </TouchableOpacity>
            </View>
            
            {availableJobs.slice(0, 2).map((job) => (
              <TouchableOpacity 
                key={job.id}
                style={[globalStyles.card, { marginBottom: 12 }]}
                onPress={() => navigation.navigate('JobDetails', { job })}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <CustomText type="body" style={{ fontWeight: '600', marginBottom: 4 }}>{job.title}</CustomText>
                    <CustomText type="caption" style={{ marginBottom: 8 }}>{job.description}</CustomText>
                  </View>
                  <CustomText type="body" style={{ color: '#6366f1', fontWeight: '600' }}>{job.price}</CustomText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location" size={14} color="#a3a3a3" />
                    <CustomText type="caption" style={{ marginLeft: 4, color: '#a3a3a3' }}>{job.distance}</CustomText>
                  </View>
                  <CustomText type="caption" style={{ color: '#a3a3a3' }}>{job.time}</CustomText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* My Jobs */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <CustomText type="heading">My Jobs</CustomText>
              <TouchableOpacity onPress={() => navigation.navigate('MyJobs')}>
                <CustomText type="caption" style={{ color: '#6366f1' }}>View All</CustomText>
              </TouchableOpacity>
            </View>
            
            {myJobs.map((job) => (
              <TouchableOpacity 
                key={job.id}
                style={[globalStyles.card, { marginBottom: 12 }]}
                onPress={() => navigation.navigate('JobDetails', { job })}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <CustomText type="body" style={{ fontWeight: '600' }}>{job.title}</CustomText>
                  <View style={{ 
                    backgroundColor: getStatusColor(job.status) + '20', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 12 
                  }}>
                    <CustomText type="caption" style={{ color: getStatusColor(job.status), textTransform: 'capitalize' }}>
                      {job.status}
                    </CustomText>
                  </View>
                </View>
                <CustomText type="caption" style={{ marginBottom: 8 }}>For {job.client}</CustomText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CustomText type="caption" style={{ color: '#a3a3a3' }}>{job.time}</CustomText>
                  <CustomText type="body" style={{ color: '#6366f1', fontWeight: '600' }}>{job.price}</CustomText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TaskerHomeScreen;