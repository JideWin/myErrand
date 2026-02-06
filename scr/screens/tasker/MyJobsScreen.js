// src/screens/tasker/MyJobsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const MyJobsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');

  const jobsData = {
    active: [
      {
        id: '1',
        title: 'House Cleaning',
        client: 'Sarah Johnson',
        budget: '$50',
        status: 'In Progress',
        deadline: 'Today, 5:00 PM',
        location: 'Downtown',
      },
      {
        id: '2',
        title: 'Grocery Shopping',
        client: 'Mike Thompson',
        budget: '$30',
        status: 'Scheduled',
        deadline: 'Tomorrow, 10:00 AM',
        location: 'Northside',
      },
    ],
    completed: [
      {
        id: '3',
        title: 'Furniture Assembly',
        client: 'Emily Davis',
        budget: '$80',
        status: 'Completed',
        completedDate: 'Oct 12, 2023',
        rating: 5,
        earnings: '$72', // after platform fee
      },
      {
        id: '4',
        title: 'Package Delivery',
        client: 'Robert Wilson',
        budget: '$25',
        status: 'Completed',
        completedDate: 'Oct 10, 2023',
        rating: 4,
        earnings: '$22.50', // after platform fee
      },
    ],
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={[styles.status, 
          item.status === 'Completed' ? styles.statusCompleted : 
          item.status === 'In Progress' ? styles.statusProgress : 
          styles.statusScheduled
        ]}>
          {item.status}
        </Text>
      </View>
      
      <Text style={styles.jobDetails}>Client: {item.client}</Text>
      <Text style={styles.jobDetails}>Budget: {item.budget}</Text>
      <Text style={styles.jobDetails}>Location: {item.location}</Text>
      
      {item.deadline && (
        <Text style={styles.jobDetails}>Deadline: {item.deadline}</Text>
      )}
      
      {item.completedDate && (
        <Text style={styles.jobDetails}>Completed: {item.completedDate}</Text>
      )}
      
      {item.earnings && (
        <Text style={styles.jobDetails}>Earnings: {item.earnings}</Text>
      )}
      
      {item.rating && (
        <Text style={styles.jobDetails}>Rating: {'⭐'.repeat(item.rating)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {jobsData[activeTab].map((item) => (
          <View key={item.id}>
            {renderJobItem({ item })}
          </View>
        ))}
        
        {jobsData[activeTab].length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === 'active' 
                ? 'No active jobs' 
                : 'No completed jobs yet'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusScheduled: {
    backgroundColor: '#ffeaa7',
    color: '#d35400',
  },
  statusProgress: {
    backgroundColor: '#81ecec',
    color: '#00cec9',
  },
  statusCompleted: {
    backgroundColor: '#55efc4',
    color: '#00b894',
  },
  jobDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default MyJobsScreen;