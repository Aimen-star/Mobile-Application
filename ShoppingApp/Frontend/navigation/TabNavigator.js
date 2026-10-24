import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useCart } from '../components/CartContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { colors } = useCart();

  // Choose an icon for each tab.
  function getTabIcon(routeName, focused) {
    const icons = {
      Home: focused ? 'home' : 'home-outline',
      Categories: focused ? 'grid' : 'grid-outline',
      Cart: focused ? 'cart' : 'cart-outline',
      Profile: focused ? 'person' : 'person-outline',
    };

    return icons[routeName];
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 62,
          paddingTop: 6,
          paddingBottom: 7,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoryScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}