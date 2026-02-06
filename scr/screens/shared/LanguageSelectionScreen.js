// src/screens/shared/LanguageSelectionScreen.js
import React from 'react';
import { View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/GlobalStyles';
import { CustomText } from '../../components/CustomText';

const languages = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Français' },
  { id: 'de', name: 'Deutsch' },
  { id: 'zh', name: '中文' },
];

const LanguageSelectionScreen = ({ navigation, route }) => {
  // Get the current theme from the route params if available
  const { isDarkMode } = route.params || {};

  const lightColors = {
    background: '#ffffff',
    text: '#000000',
    card: '#ffffff',
    border: '#f0f0f0',
    icon: '#008080',
  };

  const darkColors = {
    background: '#121212',
    text: '#ffffff',
    card: '#1e1e1e',
    border: '#333333',
    icon: '#008080',
  };

  const currentColors = isDarkMode ? darkColors : lightColors;
  const currentLanguage = route.params.currentLanguage;

  const handleLanguageSelect = (languageName) => {
    // Navigate back to the previous screen and pass the selected language
    navigation.navigate({
      name: 'SettingsScreen',
      params: { selectedLanguage: languageName },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: currentColors.background }]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: currentColors.background }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={currentColors.text} />
          </TouchableOpacity>
          <CustomText type="heading" style={{ color: currentColors.text }}>Select Language</CustomText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView>
          {languages.map((lang) => (
            <TouchableOpacity 
              key={lang.id} 
              onPress={() => handleLanguageSelect(lang.name)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 18,
                backgroundColor: currentColors.card,
                borderBottomWidth: 1,
                borderBottomColor: currentColors.border,
              }}
            >
              <CustomText 
                type="body" 
                style={{ 
                  color: currentColors.text, 
                  fontWeight: currentLanguage === lang.name ? 'bold' : 'normal' 
                }}
              >
                {lang.name}
              </CustomText>
              {currentLanguage === lang.name && (
                <Ionicons name="checkmark-circle-outline" size={24} color={currentColors.icon} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;