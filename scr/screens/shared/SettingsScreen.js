// src/screens/shared/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/GlobalStyles';
import { CustomText } from '../../components/CustomText';

const SettingsScreen = ({ navigation, route }) => {
  const lightColors = {
    background: '#ffffff',
    text: '#000000',
    card: '#ffffff',
    border: '#f0f0f0',
    icon: '#008080',
    switchTrackOn: '#008080',
    switchTrackOff: '#cccccc',
    caption: '#aaaaaa',
  };

  const darkColors = {
    background: '#121212',
    text: '#ffffff',
    card: '#1e1e1e',
    border: '#333333',
    icon: '#008080',
    switchTrackOn: '#008080',
    switchTrackOff: '#555555',
    caption: '#888888',
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentColors = isDarkMode ? darkColors : lightColors;

  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    sound: true,
    vibration: true,
    language: 'English',
  });

  // This useEffect will listen for changes in the route params
  useEffect(() => {
    if (route.params?.selectedLanguage) {
      setSettings(prevSettings => ({
        ...prevSettings,
        language: route.params.selectedLanguage,
      }));
    }
  }, [route.params?.selectedLanguage]);

  const toggleSetting = (setting) => {
    if (setting === 'darkMode') {
      setIsDarkMode(!isDarkMode);
    }
    
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  const handleLanguagePress = () => {
    navigation.navigate('LanguageSelectionScreen', {
      isDarkMode: isDarkMode, // Pass the current theme
      currentLanguage: settings.language, // Pass the current language
    });
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        { 
          id: 'notifications', 
          title: 'Push Notifications', 
          icon: 'notifications-outline',
          type: 'switch',
          value: settings.notifications,
        },
        { 
          id: 'location', 
          title: 'Location Services', 
          icon: 'location-outline',
          type: 'switch',
          value: settings.location,
        },
        { 
          id: 'darkMode', 
          title: 'Dark Mode', 
          icon: 'moon-outline',
          type: 'switch',
          value: isDarkMode,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        { 
          id: 'sound', 
          title: 'Sounds', 
          icon: 'volume-medium-outline',
          type: 'switch',
          value: settings.sound,
        },
        { 
          id: 'vibration', 
          title: 'Vibration', 
          icon: 'phone-portrait-outline',
          type: 'switch',
          value: settings.vibration,
        },
        { 
          id: 'language', 
          title: 'Language', 
          icon: 'language-outline',
          type: 'link',
          value: settings.language,
          action: handleLanguagePress,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { 
          id: 'help', 
          title: 'Help Center', 
          icon: 'help-circle-outline',
          type: 'link',
        },
        { 
          id: 'contact', 
          title: 'Contact Support', 
          icon: 'chatbubble-ellipses-outline',
          type: 'link',
        },
        { 
          id: 'privacy', 
          title: 'Privacy Policy', 
          icon: 'lock-closed-outline',
          type: 'link',
        },
        { 
          id: 'terms', 
          title: 'Terms of Service', 
          icon: 'document-text-outline',
          type: 'link',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: currentColors.background }]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: currentColors.background }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={currentColors.text} />
          </TouchableOpacity>
          <CustomText type="heading" style={{ color: currentColors.text }}>Settings</CustomText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1 }}>
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={[globalStyles.card, { marginBottom: 24, backgroundColor: currentColors.card }]}>
              <CustomText type="heading" style={{ marginBottom: 16, color: currentColors.text }}>
                {section.title}
              </CustomText>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={item.type === 'link' ? item.action : undefined}
                  disabled={item.type === 'switch'}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: currentColors.border,
                  }}
                >
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={currentColors.icon} 
                    style={{ marginRight: 16, width: 24 }} 
                  />
                  
                  <View style={{ flex: 1 }}>
                    <CustomText type="body" style={{ color: currentColors.text }}>{item.title}</CustomText>
                    {item.value && (
                      <CustomText type="caption" style={{ color: currentColors.caption }}>
                        {item.value}
                      </CustomText>
                    )}
                  </View>

                  {item.type === 'switch' ? (
                    <Switch
                      value={item.id === 'darkMode' ? isDarkMode : settings[item.id]}
                      onValueChange={() => toggleSetting(item.id)}
                      trackColor={{ false: currentColors.switchTrackOff, true: currentColors.switchTrackOn }}
                      thumbColor="#ffffff"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={currentColors.border} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* App Version */}
          <View style={{ alignItems: 'center', padding: 16 }}>
            <CustomText type="caption" style={{ color: currentColors.caption }}>
              Errand App v1.0.0
            </CustomText>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;