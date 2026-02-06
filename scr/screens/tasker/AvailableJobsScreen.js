// src/screens/tasker/AvailableJobsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const AvailableJobsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'repairs', name: 'Repairs' },
  ];

  const jobs = [
    {
      id: '1',
      title: 'House Cleaning',
      description: 'Need someone to clean my 2-bedroom apartment',
      budget: '$50',
      location: 'Downtown',
      category: 'cleaning',
      posted: '2 hours ago',
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      description: 'Need someone to buy groceries from Walmart',
      budget: '$30',
      location: 'Northside',
      category: 'shopping',
      posted: '1 hour ago',
    },
    {
      id: '3',
      title: 'Furniture Assembly',
      description: 'Need help assembling IKEA furniture',
      budget: '$80',
      location: 'West End',
      category: 'repairs',
      posted: '3 hours ago',
    },
    {
      id: '4',
      title: 'Package Delivery',
      description: 'Need to deliver a package across town',
      budget: '$25',
      location: 'Eastside',
      category: 'delivery',
      posted: '30 minutes ago',
    },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Jobs</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.jobsContainer}>
        {filteredJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => navigation.navigate('JobDetails', { job })}
          >
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobBudget}>{job.budget}</Text>
            </View>
            <Text style={styles.jobDescription}>{job.description}</Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobLocation}>📍 {job.location}</Text>
              <Text style={styles.jobPosted}>{job.posted}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No jobs available in this category
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
  searchSection: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 4,
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  jobsContainer: {
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
  jobBudget: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  jobDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  jobPosted: {
    fontSize: 12,
    color: '#bdc3c7',
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

export default AvailableJobsScreen;