/*import  { useState } from 'react';
import { ScrollView,View, Text, TextInput, Image } from 'react-native';

import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/customButton';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <ScrollView contentContainerStyle={GlobalStyles.container}
    keyboardShouldPersistTaps="handled"
    >

      <Text style={GlobalStyles.title}>
        Profile
      </Text>

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
        }}
        style={GlobalStyles.profileImage}
      />

      {/*Name*/

       /*<View style={GlobalStyles.inputContainer}>

        <Text style={GlobalStyles.label}>
          Name
        </Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      </View>

      {/*Age*/
        /*<View style={GlobalStyles.inputContainer}>

        <Text style={GlobalStyles.label}>
          Age
        </Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
       </View>

      <View style={GlobalStyles.infoBox}>

        <Text style={GlobalStyles.infoTitle}>
          Profile Information
        </Text>

        <Text style={GlobalStyles.infoText}>
          Name: {name}
        </Text>

        <Text style={GlobalStyles.infoText}>
          Age: {age}
        </Text>

      </View>

      <CustomButton
        title="Back to Home"
        onPress={() => navigation.navigate('Main',{screen:'Home'})}
      />

    </ScrollView>
  );
}*/
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/customButton';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const { width } = useWindowDimensions();

  const imageSize = Math.min(Math.max(width * 0.36, 120), 160);

  return (
    <SafeAreaView style={GlobalStyles.safeArea} edges={['bottom']}>
      <ScrollView
        style={GlobalStyles.profileScroll}
        contentContainerStyle={GlobalStyles.profileContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <Text style={GlobalStyles.title}>
          Profile
        </Text>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
          }}
          style={[
            GlobalStyles.profileImage,
            {
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            },
          ]}
        />

        <View style={GlobalStyles.inputContainer}>
          <Text style={GlobalStyles.label}>
            Name
          </Text>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={GlobalStyles.inputContainer}>
          <Text style={GlobalStyles.label}>
            Age
          </Text>

          <TextInput
            style={GlobalStyles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={GlobalStyles.infoBox}>
          <Text style={GlobalStyles.infoTitle}>
            Profile Information
          </Text>

          <Text style={GlobalStyles.infoText}>
            Name: {name}
          </Text>

          <Text style={GlobalStyles.infoText}>
            Age: {age}
          </Text>
        </View>

        <CustomButton
          title="Back to Home"
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
        />
      </ScrollView>
    </SafeAreaView>
  );
}