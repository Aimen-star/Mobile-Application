import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from '../screens/profileScreen';
import SettingsScreen from '../screens/settingScreen';
import ContactScreen from '../screens/contactScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    
    <Tab.Navigator
     screenOptions={({ route }) => ({
      //display an icon for each tab
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
      } else if (route.name === 'Settings') {
        iconName = focused ? 'settings' : 'settings-outline';
      } else if (route.name === 'Contact') {
        iconName = focused ? 'mail' : 'mail-outline';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#4A6FA5',
    tabBarInactiveTintColor: '#777777',
  })}
    >

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />

      <Tab.Screen
        name="Contact"
        component={ContactScreen}
      />

    </Tab.Navigator>
  );
}