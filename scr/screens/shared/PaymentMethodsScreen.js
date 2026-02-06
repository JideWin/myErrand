// src/screens/shared/PaymentMethodsScreen.js
import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/GlobalStyles';
import { CustomText } from '../../components/CustomText';

const PaymentMethodsScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
      expiry: '12/25'
    },
    {
      id: '2',
      type: 'card',
      last4: '3579',
      brand: 'Mastercard',
      isDefault: false,
      expiry: '08/24'
    },
    {
      id: '3',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);

  const setDefaultMethod = (id) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const deleteMethod = (id) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setPaymentMethods(methods => 
              methods.filter(method => method.id !== id)
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#f8fafc" />
          </TouchableOpacity>
          <CustomText type="heading">Payment Methods</CustomText>
          <TouchableOpacity onPress={() => navigation.navigate('AddPayment')}>
            <Ionicons name="add" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={[globalStyles.card, { marginBottom: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons 
                    name={method.type === 'paypal' ? 'logo-paypal' : 'card'} 
                    size={32} 
                    color="#6366f1" 
                    style={{ marginRight: 16 }}
                  />
                  <View>
                    <CustomText type="body" style={{ fontWeight: '600' }}>
                      {method.type === 'paypal' ? 'PayPal' : `${method.brand} •••• ${method.last4}`}
                    </CustomText>
                    {method.type === 'card' && (
                      <CustomText type="caption" style={{ color: '#a3a3a3' }}>
                        Expires {method.expiry}
                      </CustomText>
                    )}
                    {method.type === 'paypal' && (
                      <CustomText type="caption" style={{ color: '#a3a3a3' }}>
                        {method.email}
                      </CustomText>
                    )}
                  </View>
                </View>
                
                {method.isDefault && (
                  <View style={{ backgroundColor: '#10b98120', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                    <CustomText type="caption" style={{ color: '#10b981' }}>Default</CustomText>
                  </View>
                )}
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                {!method.isDefault && (
                  <>
                    <TouchableOpacity 
                      style={{ marginRight: 16 }}
                      onPress={() => setDefaultMethod(method.id)}
                    >
                      <CustomText style={{ color: '#6366f1' }}>Set Default</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteMethod(method.id)}>
                      <CustomText style={{ color: '#ef4444' }}>Remove</CustomText>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[globalStyles.button, { marginTop: 24 }]}
            onPress={() => navigation.navigate('AddPayment')}
          >
            <Ionicons name="add" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <CustomText style={globalStyles.buttonText}>Add Payment Method</CustomText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;