import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/customButton';

export default function HomeScreen({ navigation }) {

  return (
    <ImageBackground
      source={require('../../assets/student.jpeg')}
      style={GlobalStyles.background}
    >

      <View style={GlobalStyles.container}>

        <Text style={GlobalStyles.title}>
          Student Portal
        </Text>

        <Text style={GlobalStyles.subtitle}>
          Welcome to my Student Application
        </Text>

        <CustomButton
          title="Profile"
          onPress={() => navigation.navigate('Profile')}
        />

        <CustomButton
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

        <CustomButton
          title="Contact"
          onPress={() => navigation.navigate('Contact')}
        />

      </View>

    </ImageBackground>
  );
}