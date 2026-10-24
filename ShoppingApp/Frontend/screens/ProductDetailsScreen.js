import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../styling/Colors';
import { getProductPrice } from '../styling/pricing';
import { useCart } from '../components/CartContext';

const PRODUCT_COLORS = [
  { name: 'Black', value: '#292929' },
  { name: 'Brown', value: '#B65E3C' },
  { name: 'Blush', value: '#E9A69A' },
  { name: 'Cream', value: '#EAD8C8' },
];

export default function ProductDetailsScreen({ navigation, route }) {
  const cartContext = useCart();
  const colors = cartContext.colors || Colors;
  const styles = createStyles(colors);

  const product = route.params?.product;
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wasAdded, setWasAdded] = useState(false);

  if (!product) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.emptyText}>Product details are unavailable.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const price = getProductPrice(product);

  // Fake Store uses "image"; DummyJSON uses "thumbnail" or "images".
  const productImage =
    product.image || product.thumbnail || product.images?.[0];

  // Fake Store provides a rating object; DummyJSON provides a number.
  const productRating =
    typeof product.rating === 'number'
      ? product.rating
      : product.rating?.rate;

  const reviewCount =
    product.rating?.count ?? product.reviews?.length;

  function handleAddToCart() {
    // Keep the selected color and quantity with the cart item.
    const productToAdd = {
      ...product,
      selectedColor: selectedColor.name,
    };

    // CartContext asks the user to log in before adding if needed.
    const added = cartContext.addToCart(productToAdd, quantity);

    if (added) {
      setWasAdded(true);
      setTimeout(() => setWasAdded(false), 1600);
      return;
    }

    Alert.alert(
      'Login required',
      'Please log in or sign up before adding products to your cart.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log In',
          onPress: () => navigation.navigate('Login'),
        },
        {
          text: 'Sign Up',
          onPress: () => navigation.navigate('SignUp'),
        },
      ]
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back and favorite buttons. */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={21} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => setIsFavorite((current) => !current)}
          accessibilityLabel={
            isFavorite ? 'Remove from saved items' : 'Save item'
          }
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={21}
            color={isFavorite ? colors.primary : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Product photo, supporting both API image formats. */}
      <View style={styles.imageBox}>
        {productImage ? (
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="image-outline" size={42} color={colors.muted} />
        )}

        {price.hasSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>
              {price.salePercent}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Product name, category, rating, and price. */}
      <Text style={styles.category}>
        {(product.category || 'Product').replaceAll('-', ' ')}
      </Text>

      <Text style={styles.name}>{product.title}</Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color="#D99B22" />
        <Text style={styles.rating}>
          {productRating != null ? productRating : 'No rating'}
        </Text>

        {reviewCount != null && (
          <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
        )}
      </View>

      <View style={styles.priceRow}>
        {price.hasSale && (
          <Text style={styles.originalPrice}>
            Rs. {price.originalPrice}
          </Text>
        )}
        <Text style={styles.finalPrice}>Rs. {price.finalPrice}</Text>
      </View>

      {/* Product description. */}
      <Text style={styles.descriptionHeading}>Description</Text>
      <Text style={styles.description}>
        {product.description || 'No description is available for this product.'}
      </Text>

      {/* Select a color. */}
      <Text style={styles.optionHeading}>Color</Text>
      <View style={styles.colorRow}>
        {PRODUCT_COLORS.map((color) => {
          const selected = selectedColor.name === color.name;

          return (
            <TouchableOpacity
              key={color.name}
              style={[
                styles.colorOuter,
                selected && styles.selectedColorOuter,
              ]}
              onPress={() => setSelectedColor(color)}
              accessibilityLabel={`Select ${color.name}`}
            >
              <View
                style={[
                  styles.colorCircle,
                  { backgroundColor: color.value },
                ]}
              />
            </TouchableOpacity>
          );
        })}

        <Text style={styles.selectedColorName}>{selectedColor.name}</Text>
      </View>

      {/* Quantity stepper. */}
      <Text style={styles.optionHeading}>Quantity</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((current) => Math.max(1, current - 1))}
          accessibilityLabel="Decrease quantity"
        >
          <Ionicons name="remove" size={17} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.quantity}>{quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity((current) => current + 1)}
          accessibilityLabel="Increase quantity"
        >
          <Ionicons name="add" size={17} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Add the selected product, color, and quantity to the cart. */}
      <TouchableOpacity
        style={[styles.addButton, wasAdded && styles.addedButton]}
        onPress={handleAddToCart}
        activeOpacity={0.85}
      >
        <Ionicons
          name={wasAdded ? 'checkmark' : 'cart-outline'}
          size={19}
          color={colors.white}
        />
        <Text style={styles.addButtonText}>
          {wasAdded ? 'Added to Cart' : 'Add to Cart'}
        </Text>
      </TouchableOpacity>

      {wasAdded && (
        <Text style={styles.addedMessage}>
          {quantity} {quantity === 1 ? 'item' : 'items'} added to your cart.
        </Text>
      )}
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 18,
      paddingTop: 18,
      paddingBottom: 30,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    roundButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    imageBox: {
      height: 280,
      backgroundColor: colors.white,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    productImage: {
      width: '82%',
      height: '82%',
    },
    saleBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: colors.primary,
      borderRadius: 7,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },
    saleBadgeText: {
      color: colors.white,
      fontSize: 11,
      fontWeight: 'bold',
    },
    category: {
      color: colors.muted,
      fontSize: 11,
      textTransform: 'capitalize',
      marginTop: 14,
    },
    name: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 3,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
    },
    rating: {
      color: colors.primary,
      fontSize: 11,
      marginLeft: 4,
    },
    reviewCount: {
      color: colors.muted,
      fontSize: 10,
      marginLeft: 4,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    originalPrice: {
      color: colors.muted,
      fontSize: 14,
      textDecorationLine: 'line-through',
      marginRight: 8,
    },
    finalPrice: {
      color: colors.text,
      fontSize: 19,
      fontWeight: 'bold',
    },
    descriptionHeading: {
      color: colors.text,
      fontSize: 15,
      fontWeight: 'bold',
      marginTop: 17,
    },
    description: {
      color: colors.muted,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 5,
    },
    optionHeading: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
      marginTop: 17,
      marginBottom: 7,
    },
    colorRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    colorOuter: {
      width: 29,
      height: 29,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    selectedColorOuter: {
      borderColor: colors.text,
    },
    colorCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    selectedColorName: {
      color: colors.muted,
      fontSize: 11,
      marginLeft: 3,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 9,
    },
    quantityButton: {
      width: 34,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantity: {
      color: colors.text,
      minWidth: 28,
      textAlign: 'center',
      fontSize: 12,
    },
    addButton: {
      height: 48,
      backgroundColor: colors.text,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    addedButton: {
      backgroundColor: '#27824B',
    },
    addButtonText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    addedMessage: {
      color: '#27824B',
      fontSize: 12,
      textAlign: 'center',
      marginTop: 8,
    },
    emptyScreen: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyText: {
      color: colors.text,
      fontSize: 15,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 11,
      borderRadius: 10,
      marginTop: 15,
    },
    backButtonText: {
      color: colors.white,
      fontWeight: 'bold',
    },
  });
}