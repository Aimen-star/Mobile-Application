import React, { useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Temporary online fashion photo with a warm Veylora color palette.
//const SPLASH_IMAGE =
  //'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85';

export default function SplashScreen({ navigation }) {
  // Automatically open the main app after the splash screen.
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/pic2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      {/* Soft overlay keeps the text readable over the photo. */}
      <View style={styles.overlay}>
        <View style={styles.topText}>
          <Text style={styles.brand}>Veylora</Text>
          <Text style={styles.tagline}>Style That Feels Like You</Text>
        </View>

        <View style={styles.bottomText}>
          <Text style={styles.offer}>20% OFF</Text>
          <Text style={styles.limitedStock}>— Limited Stock!</Text>
          <Text style={styles.styleLine}>Style · Fashion · You</Text>
          <Text style={styles.explore}>Explore Veylora</Text>

          {/* Decorative splash-screen dots. */}
          <View style={styles.dots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.footer}>Fashion for Every Mood</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#5A4032',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 32,

    // Light darkening across the image improves text contrast.
    backgroundColor: 'rgba(31, 20, 14, 0.27)',
  },
  topText: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(45, 29, 20, 0.24)',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 43,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 7,
  },
  tagline: {
    color: '#FFF7EF',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 5,
  },
  bottomText: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 29, 20, 0.36)',
  },
  offer: {
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
  },
  limitedStock: {
    color: '#FFE3C5',
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowRadius: 7,
  },
  styleLine: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 2,
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 5,
  },
  explore: {
    color: '#FFF7EF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 5,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 19,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  footer: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 17,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowRadius: 5,
  },
});