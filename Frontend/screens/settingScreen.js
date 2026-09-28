

import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';

import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/customButton';

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View
      style={[
        GlobalStyles.container,
        darkMode && GlobalStyles.darkContainer
      ]}
    >

      <Text
        style={[
          GlobalStyles.title,
          darkMode && GlobalStyles.darkText
        ]}
      >
        Settings
      </Text>

      <View
        style={[
          GlobalStyles.settingBox,
          darkMode && GlobalStyles.darkSettingBox
        ]}
      >

        <View style={GlobalStyles.settingRow}>

          <Text
            style={[
              GlobalStyles.settingText,
              darkMode && GlobalStyles.darkText
            ]}
          >
            Dark Mode
          </Text>

          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />

        </View>

        <Text
          style={[
            GlobalStyles.modeText,
            darkMode && GlobalStyles.darkText
          ]}
        >
          {darkMode
            ? 'Dark Mode is ON'
            : 'Light Mode is ON'}
        </Text>

      </View>

      <CustomButton
        title="Back to Home"
        onPress={() => navigation.navigate('Main',{screen:'Home'})}
      />

    </View>
  );
}