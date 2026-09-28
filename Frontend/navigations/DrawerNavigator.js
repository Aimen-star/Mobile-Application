import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/homeScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>

      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Student Sections"
        component={BottomTabNavigator}
      />

    </Drawer.Navigator>
  );
}