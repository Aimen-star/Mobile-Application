import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../styling/Colors';
import { useCart } from '../components/CartContext';

export default function SignUpScreen({ navigation }) {
  const cartContext = useCart();
  const colors = cartContext.colors || Colors;
  const styles = createStyles(colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignUp() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing information', 'Complete all fields to sign up.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Password too short',
        'Use at least 6 characters for the password.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Check both password fields.');
      return;
    }

    const result = cartContext.signUp(name, email, password);

    if (!result.success) {
      Alert.alert('Sign up failed', result.message || 'Please try again.');
      return;
    }

    // Context saves the user's name and email and adds any pending product.
    navigation.replace('MainTabs');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand heading */}
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons
              name="bag-handle-outline"
              size={29}
              color={colors.primary}
            />
          </View>
          <Text style={styles.brandName}>Veylora</Text>
          <Text style={styles.tagline}>Style · Fashion · You</Text>
        </View>

        {/* Signup form */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start shopping</Text>

        <InputField
          icon="person-outline"
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          styles={styles}
          colors={colors}
        />

        <InputField
          icon="mail-outline"
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          styles={styles}
          colors={colors}
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          styles={styles}
          colors={colors}
        />

        <InputField
          icon="lock-closed-outline"
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          styles={styles}
          colors={colors}
        />

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignUp}
          activeOpacity={0.85}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Existing users can return to Login. */}
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable input field for the signup form.
function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  styles,
  colors,
  ...inputProps
}) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={19} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoCorrect={false}
        {...inputProps}
      />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    brand: {
      alignItems: 'center',
      marginBottom: 26,
    },
    logo: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandName: {
      color: colors.text,
      fontSize: 30,
      fontWeight: 'bold',
      marginTop: 7,
    },
    tagline: {
      color: colors.muted,
      fontSize: 11,
      letterSpacing: 1,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.muted,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 20,
    },
    inputContainer: {
      minHeight: 49,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 13,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      marginLeft: 10,
      paddingVertical: 12,
    },
    signupButton: {
      height: 51,
      backgroundColor: colors.text,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 7,
    },
    signupButtonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: 'bold',
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    loginPrompt: {
      color: colors.muted,
      fontSize: 13,
    },
    loginLink: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: 'bold',
    },
  });
}