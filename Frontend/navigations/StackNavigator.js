import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import ProfileScreen from '../screens/profileScreen';
import SettingsScreen from '../screens/settingScreen';
import ContactScreen from '../screens/contactScreen';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
       name="Profile"
       component={ProfileScreen}
      />

      <Stack.Screen 
      name="Settings" 
      component={SettingsScreen} 
      />

      <Stack.Screen
        name="Contact"
        component={ContactScreen}
      />

    </Stack.Navigator>
  );
}