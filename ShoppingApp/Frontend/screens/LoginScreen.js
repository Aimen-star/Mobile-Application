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

export default function LoginScreen({ navigation }) {
  const cartContext = useCart();
  const colors = cartContext.colors || Colors;
  const styles = createStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing information', 'Enter your email and password.');
      return;
    }

    const result = cartContext.logIn(email, password);

    if (!result.success) {
      Alert.alert('Login failed', result.message);
      return;
    }

    // Context also adds any product waiting for the user to log in.
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

        {/* Login form */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={19}
            color={colors.muted}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={19}
            color={colors.muted}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Open signup if the user has not created an account. */}
        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.backLinkText}>Continue shopping as a guest</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
      marginBottom: 35,
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
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.muted,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 5,
      marginBottom: 24,
    },
    inputContainer: {
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 13,
      marginBottom: 13,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      marginLeft: 10,
      paddingVertical: 12,
    },
    loginButton: {
      height: 51,
      backgroundColor: colors.text,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 7,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: 'bold',
    },
    signupRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 22,
    },
    signupPrompt: {
      color: colors.muted,
      fontSize: 13,
    },
    signupLink: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: 'bold',
    },
    backLink: {
      alignItems: 'center',
      marginTop: 25,
      padding: 8,
    },
    backLinkText: {
      color: colors.primary,
      fontSize: 13,
    },
  });
}