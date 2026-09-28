import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/customButton';

export default function ContactScreen({ navigation }) {

  const [email, setEmail] = useState('');

 
  const handleSubmit = () => {
  if (email === '') {
    Alert.alert(
      'Error',
      'Please enter your email first.'
    );
  } else if (!email.includes('@') || !email.includes('.')) {
    Alert.alert(
      'Error',
      'Please enter a valid email with @ and .'
    );
  } else {
    Alert.alert(
      'Contact',
      'Email is submitted successfully'
    );
  }
};

  return (
    <View style={GlobalStyles.container}>

      <Text style={GlobalStyles.title}>
        Contact
      </Text>

      <Text style={GlobalStyles.contactSubtitle}>
        We'd love to hear from you!
      </Text>

      <View style={GlobalStyles.inputRow}>

        <Ionicons
          name="mail-outline"
          size={24}
          color="#4A6FA5"
        />

        <TextInput
          style={GlobalStyles.emailInput}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          inputMode="email"
        />

      </View>

      <CustomButton
        title="Submit"
        onPress={handleSubmit}
      />

      <CustomButton
        title="Back to Home"
        onPress={() => navigation.navigate('Main',{screen:'Home'})}
      />

    </View>
  );
}