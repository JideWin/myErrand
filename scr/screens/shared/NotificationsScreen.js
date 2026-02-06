// src/screens/shared/NotificationsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      title: 'New Job Available',
      message: 'A new house cleaning job is available in your area',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      title: 'Job Accepted',
      message: 'John Doe has accepted your grocery shopping request',
      time: '5 hours ago',
      read: true,
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'You received $45 for the furniture assembly job',
      time: '1 day ago',
      read: true,
    },
    {
      id: '4',
      title: 'New Rating',
      message: 'You received a 5-star rating from Sarah Johnson',
      time: '2 days ago',
      read: true,
    },
  ]);

  const [settings, setSettings] = React.useState({
    jobAlerts: true,
    messages: true,
    payments: true,
    ratings: true,
    promotions: false,
  });

  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Job Alerts</Text>
              <Text style={styles.settingDescription}>Get notified about new jobs</Text>
            </View>
            <Switch
              value={settings.jobAlerts}
              onValueChange={() => toggleSetting('jobAlerts')}
            />
          </View>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Messages</Text>
              <Text style={styles.settingDescription}>Notify about new messages</Text>
            </View>
            <Switch
              value={settings.messages}
              onValueChange={() => toggleSetting('messages')}
            />
          </View>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Payments</Text>
              <Text style={styles.settingDescription}>Payment updates</Text>
            </View>
            <Switch
              value={settings.payments}
              onValueChange={() => toggleSetting('payments')}
            />
          </View>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Ratings</Text>
              <Text style={styles.settingDescription}>New rating notifications</Text>
            </View>
            <Switch
              value={settings.ratings}
              onValueChange={() => toggleSetting('ratings')}
            />
          </View>
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Promotions</Text>
              <Text style={styles.settingDescription}>Special offers and promotions</Text>
            </View>
            <Switch
              value={settings.promotions}
              onValueChange={() => toggleSetting('promotions')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    fontSize: 24,
    color: '#3498db',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  clearButton: {
    color: '#3498db',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  unreadNotification: {
    backgroundColor: '#e3f2fd',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#bdc3c7',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginLeft: 8,
  },
});

export default NotificationsScreen;