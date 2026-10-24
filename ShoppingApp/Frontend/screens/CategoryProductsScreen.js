import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../styling/Colors';
import { useCart } from '../components/CartContext';
import { getProductPrice } from '../styling/pricing';

const API_URL = 'https://dummyjson.com/products?limit=0';

export default function CategoryProductsScreen({ navigation, route }) {
  const { colors: themeColors } = useCart();
  const colors = themeColors || Colors;
  const styles = makeStyles(colors);

  const title = route.params?.title || 'Products';
  const apiCategories = route.params?.apiCategories || [];
  const showClothingOptions = route.params?.showClothingOptions || false;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClothingType, setSelectedClothingType] = useState('');

  // Fetch products for the category selected on the previous screen.
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Could not load products.');
        }

        const data = await response.json();
        const filteredProducts = (data.products || []).filter((product) =>
          apiCategories.includes(product.category)
        );

        setProducts(filteredProducts);
      } catch {
        setError('Products could not load. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [apiCategories]);

  function openProduct(product) {
    // Keep the selected app category with the product for the details screen.
    navigation.navigate('ProductDetails', {
      product: selectedClothingType
        ? { ...product, clothingType: selectedClothingType }
        : product,
    });
  }

  function renderProduct(product) {
    const price = getProductPrice(product);
    const image = product.thumbnail || product.images?.[0] || product.image;

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={() => openProduct(product)}
        activeOpacity={0.85}
      >
        <View style={styles.imageBox}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="image-outline" size={32} color={colors.muted} />
          )}

          {price.hasSale && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>
                {price.salePercent}% OFF
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {product.title}
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
    >
      {/* Back returns to the category overview. */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedClothingType) {
              setSelectedClothingType('');
            } else {
              navigation.goBack();
            }
          }}
          accessibilityLabel={
            selectedClothingType ? 'Back to clothing types' : 'Back to categories'
          }
        >
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {selectedClothingType
            ? `${title} · ${selectedClothingType}`
            : title}
        </Text>

        <View style={styles.backButton} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : error ? (
        <Text style={styles.message}>{error}</Text>
      ) : (
        <>
          {/* Clothes show the required app-defined choices before products. */}
          {showClothingOptions && !selectedClothingType && (
            <View>
              <Text style={styles.instruction}>
                Choose a clothing type
              </Text>
              <Text style={styles.note}>
                The API does not label products as stitched or unstitched.
                These are app categories; available clothing products are
                shown after you choose one.
              </Text>

              <View style={styles.clothingOptions}>
                {['Stitched', 'Unstitched'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.clothingOption}
                    onPress={() => setSelectedClothingType(type)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="shirt-outline"
                      size={27}
                      color={colors.primary}
                    />
                    <Text style={styles.clothingOptionText}>{type}</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Show products after a clothing type is selected, or immediately
              for Accessories and Makeup. */}
          {(!showClothingOptions || selectedClothingType !== '') &&
            (products.length === 0 ? (
              <Text style={styles.message}>
                No sample products are available for this category.
              </Text>
            ) : (
              <View style={styles.productGrid}>
                {products.map(renderProduct)}
              </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 17,
      paddingTop: 14,
      paddingBottom: 28,
    },
    header: {
      minHeight: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 17,
    },
    backButton: {
      width: 38,
      height: 38,
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    loader: {
      marginTop: 45,
    },
    instruction: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    note: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 15,
    },
    clothingOptions: {
      gap: 11,
    },
    clothingOption: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 13,
      backgroundColor: colors.white,
    },
    clothingOptionText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 12,
    },
    productGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    productCard: {
      width: '48.5%',
      padding: 9,
      marginBottom: 13,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      backgroundColor: colors.white,
    },
    imageBox: {
      height: 155,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    productImage: {
      width: '88%',
      height: '88%',
    },
    saleBadge: {
      position: 'absolute',
      top: 7,
      left: 7,
      paddingHorizontal: 7,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    saleBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: 'bold',
    },
    productName: {
      minHeight: 36,
      marginTop: 8,
      color: colors.text,
      fontSize: 12,
    },
    priceRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
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
    message: {
      color: colors.muted,
      marginTop: 25,
      textAlign: 'center',
    },
  });
}