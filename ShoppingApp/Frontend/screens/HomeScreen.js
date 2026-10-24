import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../styling/Colors';
import { getProductPrice } from '../styling/pricing';
import { useCart } from '../components/CartContext';

const API_URL = 'https://fakestoreapi.com/products';

export default function HomeScreen({ navigation }) {
  const cartContext = useCart();

  const items = cartContext.items || [];
  const user = cartContext.user || null;
  const colors = cartContext.colors || Colors;
  const savedItems = cartContext.savedItems || [];
  const toggleSavedItem = cartContext.toggleSavedItem;
  const styles = createStyles(colors);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');

  const tickerPosition = useRef(new Animated.Value(380)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(tickerPosition, {
          toValue: -500,
          duration: 9000,
          useNativeDriver: true,
        }),
        Animated.timing(tickerPosition, {
          toValue: 380,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [tickerPosition]);
//fetch data from api
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('The product request failed.');
        }

        const data = await response.json();
        setProducts(
          data.filter((product) => product.category !== 'electronics')
        );
      } catch {
        setError('Products could not load. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function openCategory(category) {
    navigation.navigate('Categories', { category });
  }

  function openAccount() {
    navigation.navigate(user ? 'Profile' : 'Login');
  }

  function openProduct(product) {
    navigation.navigate('ProductDetails', { product });
  }

  // Check whether a product is already in Saved Items.
  function isSaved(productId) {
    return savedItems.some((product) => product.id === productId);
  }

  // Toggle the heart without opening the product details screen.
  function handleSavePress(product) {
    if (toggleSavedItem) {
      toggleSavedItem(product);
    }
  }

  const searchTerm = searchText.trim().toLowerCase();
  const matchingProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  const featuredProducts = matchingProducts.slice(0, 2);

  function renderProduct({ item }) {
    const price = getProductPrice(item);
    const saved = isSaved(item.id);

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => openProduct(item)}
        activeOpacity={0.85}
      >
        <View style={styles.productImageBox}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {price.hasSale && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>
                {price.salePercent}% OFF
              </Text>
            </View>
          )}

          {/* This separate button saves or removes the product. */}
          <TouchableOpacity
            style={styles.heart}
            onPress={() => handleSavePress(item)}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved items' : 'Save item'}
            hitSlop={8}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={17}
              color={saved ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.productCategory} numberOfLines={1}>
          {item.category}
        </Text>

        <Text style={styles.productName} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.priceRow}>
          {price.hasSale && (
            <Text style={styles.originalPrice}>
              Rs. {price.originalPrice}
            </Text>
          )}
          <Text style={styles.finalPrice}>Rs. {price.finalPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <Image
            source={require('../../assets/veylora-logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          <View>
            <Text style={styles.brand}>Veylora</Text>
            <Text style={styles.tagline}>Style · Fashion · You</Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel="Open cart"
          >
            <Ionicons name="cart-outline" size={23} color={colors.text} />
            {items.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{items.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={openAccount}
            accessibilityLabel={user ? 'Open profile' : 'Log in or sign up'}
          >
            <Ionicons
              name={user ? 'person' : 'person-outline'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={19} color={colors.muted} />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search for products..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <View style={styles.ticker}>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.tickerText,
            { transform: [{ translateX: tickerPosition }] },
          ]}
        >
          20% OFF on Shopping Above Rs. 1,200 — Available Till 20 October
        </Animated.Text>
      </View>

      <View style={styles.offerBanner}>
        <View style={styles.offerCopy}>
          <Text style={styles.offerTitle}>20% OFF</Text>
          <Text style={styles.offerDescription}>
            on Shopping Above Rs. 1,200
          </Text>
          <Text style={styles.offerDate}>Available Till 20 October</Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => openCategory('Makeup')}
          >
            <Text style={styles.shopButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../assets/pic2.jpg')}
          style={styles.offerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => openCategory('Accessories')}>
          <Text style={styles.seeAll}>See All ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        <CategoryButton
          label="Accessories"
          icon="watch-outline"
          onPress={() => openCategory('Accessories')}
          colors={colors}
          styles={styles}
        />
        <CategoryButton
          label="Clothes"
          icon="shirt-outline"
          onPress={() => openCategory('Clothes')}
          colors={colors}
          styles={styles}
        />
        <CategoryButton
          label="Makeup"
          icon="color-palette-outline"
          onPress={() => openCategory('Makeup')}
          colors={colors}
          styles={styles}
        />
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <TouchableOpacity onPress={() => openCategory('Makeup')}>
          <Text style={styles.seeAll}>See All ›</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : featuredProducts.length === 0 ? (
        <Text style={styles.emptyMessage}>No matching products found.</Text>
      ) : (
        <FlatList
          data={featuredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      )}
    </ScrollView>
  );
}

function CategoryButton({ label, icon, onPress, colors, styles }) {
  return (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.categoryIcon}>
        <Ionicons name={icon} size={27} color={colors.primary} />
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 17,
      paddingTop: 15,
      paddingBottom: 25,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    brandBlock: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    headerLogo: {
      width: 43,
      height: 43,
      marginRight: 8,
    },
    brand: {
      color: colors.text,
      fontSize: 23,
      fontWeight: 'bold',
    },
    tagline: {
      color: colors.muted,
      fontSize: 10,
      marginTop: 1,
    },
    headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      width: 40,
      height: 40,
      backgroundColor: colors.white,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    cartBadge: {
      position: 'absolute',
      right: 1,
      top: 1,
      minWidth: 16,
      height: 16,
      paddingHorizontal: 3,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: 'bold',
    },
    searchBox: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      paddingHorizontal: 13,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 13,
      marginLeft: 8,
    },
    ticker: {
      height: 32,
      overflow: 'hidden',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
      borderRadius: 8,
      marginBottom: 13,
    },
    tickerText: {
      position: 'absolute',
      width: 520,
      color: colors.text,
      fontSize: 12,
      fontWeight: 'bold',
    },
    offerBanner: {
      height: 165,
      flexDirection: 'row',
      overflow: 'hidden',
      backgroundColor: colors.secondary,
      borderRadius: 18,
      marginBottom: 20,
    },
    offerCopy: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 15,
    },
    offerTitle: {
      color: colors.text,
      fontSize: 27,
      fontWeight: 'bold',
    },
    offerDescription: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
    },
    offerDate: {
      color: colors.text,
      fontSize: 11,
      marginTop: 5,
    },
    shopButton: {
      alignSelf: 'flex-start',
      backgroundColor: colors.text,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 7,
      marginTop: 9,
    },
    shopButtonText: {
      color: colors.white,
      fontSize: 11,
      fontWeight: 'bold',
    },
    offerImage: {
      width: '40%',
      height: '100%',
    },
    sectionHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 19,
      fontWeight: 'bold',
    },
    seeAll: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 21,
    },
    categoryButton: {
      width: '32%',
      alignItems: 'center',
    },
    categoryIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryLabel: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 7,
    },
    loader: {
      marginVertical: 25,
    },
    error: {
      color: colors.primary,
      marginVertical: 15,
    },
    emptyMessage: {
      color: colors.muted,
      marginVertical: 18,
    },
    productList: {
      paddingBottom: 5,
    },
    productCard: {
      width: 170,
      backgroundColor: colors.white,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 9,
      marginRight: 12,
    },
    productImageBox: {
      height: 140,
      backgroundColor: colors.background,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productImage: {
      width: '82%',
      height: '82%',
    },
    saleBadge: {
      position: 'absolute',
      top: 7,
      left: 7,
      backgroundColor: colors.primary,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 6,
    },
    saleBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: 'bold',
    },
    heart: {
      position: 'absolute',
      top: 7,
      right: 7,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      elevation: 2,
    },
    productCategory: {
      color: colors.muted,
      textTransform: 'capitalize',
      fontSize: 10,
      marginTop: 7,
    },
    productName: {
      color: colors.text,
      fontSize: 12,
      minHeight: 34,
      marginTop: 3,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 5,
    },
    originalPrice: {
      color: colors.muted,
      fontSize: 10,
      textDecorationLine: 'line-through',
      marginRight: 5,
    },
    finalPrice: {
      color: colors.text,
      fontSize: 13,
      fontWeight: 'bold',
    },
  });
}