/*import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

/*import { useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './Frontend/screens/homeScreen';
import ProfileScreen from './Frontend/screens/profileScreen';
import SettingsScreen from './Frontend/screens/settingScreen';
import ContactScreen from './Frontend/screens/contactScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'MyFont': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  //const [screen, setScreen] = useState('home');

  
  if (!fontsLoaded) {
    return null;
  }

  /*return (
   <View style={{ flex: 1 }}>

      {screen === 'home' && (
        <HomeScreen setScreen={setScreen} />
      )}

      {screen === 'profile' && (
        <ProfileScreen setScreen={setScreen} />
      )}

      {screen === 'settings' && (
        <SettingsScreen setScreen={setScreen} />
      )}

      {screen === 'contact' && (
        <ContactScreen setScreen={setScreen} />
      )}

    </View>
  );
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Profile" component={ProfileScreen}/>
        <Stack.Screen name="Settings" component={SettingsScreen}/>
        <Stack.Screen name="Contact" component={ContactScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
import 'react-native-gesture-handler';

import React from 'react';
import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './Frontend/navigations/StackNavigator';

export default function App() {

  const [fontsLoaded] = useFonts({
    MyFont: require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

