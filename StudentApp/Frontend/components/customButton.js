import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { GlobalStyles } from '../styles/GlobalStyles';

export default function CustomButton({ title, onPress }) {

  return (
    <TouchableOpacity
      style={GlobalStyles.button}
      onPress={onPress}
    >
      <Text style={GlobalStyles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}