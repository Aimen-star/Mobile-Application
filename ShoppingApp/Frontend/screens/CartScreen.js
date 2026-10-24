import React from 'react';
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
import { getProductPrice, getOrderDiscount } from '../styling/pricing';
import { useCart } from '../components/CartContext';

export default function CartScreen({ navigation }) {
  const cartContext = useCart();
  const items = cartContext.items || [];
  const colors = cartContext.colors || Colors;
  const styles = createStyles(colors);

  const subtotal = items.reduce((sum, item) => {
    const price = getProductPrice(item);
    return sum + price.finalPrice * item.quantity;
  }, 0);

  const discount = getOrderDiscount(subtotal);
  const total = subtotal - discount;
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function openCheckout() {
    if (items.length === 0) {
      Alert.alert('Your cart is empty', 'Add a product before checkout.');
      return;
    }

    navigation.navigate('Checkout');
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button, page title, and cart icon. */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Home')}
            accessibilityLabel="Go to Home"
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>My Cart</Text>

          <View style={styles.headerButton}>
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.subtitle}>
          {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cart-outline" size={54} color={colors.muted} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Browse products and add your favourites.
            </Text>

            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => {
              const price = getProductPrice(item);
              const itemImage =
                item.image || item.thumbnail || item.images?.[0];

              return (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.imageBox}>
                    {itemImage ? (
                      <Image
                        source={{ uri: itemImage }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons
                        name="image-outline"
                        size={28}
                        color={colors.muted}
                      />
                    )}
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <View style={styles.priceRow}>
                      {price.hasSale && (
                        <Text style={styles.originalPrice}>
                          Rs. {price.originalPrice}
                        </Text>
                      )}
                      <Text style={styles.price}>
                        Rs. {price.finalPrice}
                      </Text>
                    </View>

                    <View style={styles.itemActions}>
                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            cartContext.changeQuantity(item.id, -1)
                          }
                          accessibilityLabel="Decrease quantity"
                        >
                          <Ionicons
                            name="remove"
                            size={17}
                            color={colors.text}
                          />
                        </TouchableOpacity>

                        <Text style={styles.quantity}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() =>
                            cartContext.changeQuantity(item.id, 1)
                          }
                          accessibilityLabel="Increase quantity"
                        >
                          <Ionicons
                            name="add"
                            size={17}
                            color={colors.text}
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => cartContext.removeFromCart(item.id)}
                        accessibilityLabel="Remove product"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.muted}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.lineTotal}>
                      Item total: Rs. {price.finalPrice * item.quantity}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Promotion message and order price summary. */}
            <View style={styles.offerBox}>
              <Ionicons
                name="gift-outline"
                size={22}
                color={colors.primary}
              />
              <Text style={styles.offerText}>
                {discount > 0
                  ? 'Your 20% order discount is applied!'
                  : `Spend Rs. ${Math.max(0, 1201 - subtotal)} more to unlock 20% OFF.`}
              </Text>
            </View>

            <View style={styles.summaryBox}>
              <PriceRow label="Subtotal" value={`Rs. ${subtotal}`} styles={styles} />
              <PriceRow
                label="Discount (20%)"
                value={discount > 0 ? `− Rs. ${discount}` : 'Rs. 0'}
                styles={styles}
                discount
              />
              <View style={styles.divider} />
              <PriceRow
                label="Total"
                value={`Rs. ${total}`}
                styles={styles}
                total
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Keep the checkout action visible at the bottom. */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={openCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function PriceRow({ label, value, styles, discount, total }) {
  return (
    <View style={styles.priceRowSummary}>
      <Text
        style={[
          styles.summaryLabel,
          discount && styles.discountText,
          total && styles.totalText,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          discount && styles.discountText,
          total && styles.totalText,
        ]}
      >
        {value}
      </Text>
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
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 20,
    },
    header: {
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerButton: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 19,
      fontWeight: 'bold',
    },
    cartBadge: {
      position: 'absolute',
      right: 0,
      top: 0,
      minWidth: 16,
      height: 16,
      paddingHorizontal: 3,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadgeText: {
      color: colors.white,
      fontSize: 9,
      fontWeight: 'bold',
    },
    subtitle: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 5,
      marginBottom: 14,
    },
    emptyBox: {
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 25,
      marginTop: 30,
    },
    emptyTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: 'bold',
      marginTop: 13,
    },
    emptyText: {
      color: colors.muted,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 6,
    },
    shopButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 11,
      borderRadius: 11,
      marginTop: 17,
    },
    shopButtonText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: 'bold',
    },
    cartItem: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 10,
    },
    imageBox: {
      width: 78,
      height: 86,
      backgroundColor: colors.secondary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    productImage: {
      width: '86%',
      height: '86%',
    },
    productInfo: {
      flex: 1,
      marginLeft: 11,
      justifyContent: 'center',
    },
    productName: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
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
      marginRight: 6,
    },
    price: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 7,
    },
    quantityButton: {
      width: 28,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantity: {
      minWidth: 22,
      color: colors.text,
      textAlign: 'center',
      fontSize: 11,
    },
    lineTotal: {
      color: colors.muted,
      fontSize: 10,
      marginTop: 4,
    },
    offerBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.secondary,
      borderRadius: 10,
      padding: 12,
      marginTop: 14,
    },
    offerText: {
      flex: 1,
      color: colors.text,
      fontSize: 11,
      marginLeft: 9,
      lineHeight: 16,
    },
    summaryBox: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
    },
    priceRowSummary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    summaryLabel: {
      color: colors.muted,
      fontSize: 12,
    },
    summaryValue: {
      color: colors.text,
      fontSize: 12,
    },
    discountText: {
      color: '#27824B',
    },
    totalText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: 'bold',
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 11,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    checkoutButton: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.text,
      borderRadius: 10,
    },
    checkoutButtonText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: 'bold',
      marginRight: 8,
    },
  });
}