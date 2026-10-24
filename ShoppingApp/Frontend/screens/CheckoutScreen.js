import React, {useState} from 'react';
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

export default function CheckoutScreen({ navigation }) {
  const cartContext = useCart();
  const items = cartContext.items || [];
  const user = cartContext.user || null;
  const colors = cartContext.colors || Colors;
  const styles = createStyles(colors);

  const subtotal = items.reduce((sum, item) => {
    const price = getProductPrice(item);
    return sum + price.finalPrice * item.quantity;
  }, 0);

  const discount = getOrderDiscount(subtotal);
  const total = subtotal - discount;

  // Store the selected demo payment method.
const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

const paymentMethods = [
  'Cash on Delivery',
  'Bank Transfer',
  'JazzCash',
  'Easypaisa',
];

  function placeOrder() {
    if (items.length === 0) {
      Alert.alert('Your cart is empty', 'Add a product before placing an order.');
      return;
    }

    // Save a copy of this order so it remains in Profile after the cart is cleared.
    cartContext.addOrder({
      user: user ? { name: user.name, email: user.email } : null,
      items: items.map((item) => ({ ...item })),
      subtotal,
      discount,
      total,
      paymentMethod, // Save the selected demo payment method with the order.
    });

   // Clear the cart after saving the order to prevent accidental duplicates.
  cartContext.clearCart();

  // Show only a simple confirmation. React Native provides a default OK button.
  Alert.alert(
    'Order placed successfully',
    `Your total payable amount is Rs. ${total}.\nPayment method:
    ${paymentMethod}.`
  );
}

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back arrow and checkout title. */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back to cart"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Checkout</Text>

        <View style={styles.backButton}>
          <Ionicons name="cart-outline" size={21} color={colors.text} />
        </View>
      </View>

      {/* Show the signed-in account for this order. */}
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Ionicons
            name="person-circle-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>Order Contact</Text>
        </View>

        {user ? (
          <>
            <Text style={styles.contactName}>{user.name}</Text>
            <Text style={styles.contactEmail}>{user.email}</Text>
          </>
        ) : (
          <Text style={styles.emptyText}>
            No signed-in account is available.
          </Text>
        )}
      </View>

      {/* Show the products and images included in the order. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {items.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        ) : (
          items.map((item) => {
            const price = getProductPrice(item);
            const itemImage =
              item.image || item.thumbnail || item.images?.[0];

            return (
              <View key={item.id} style={styles.productRow}>
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
                      size={24}
                      color={colors.muted}
                    />
                  )}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.productQuantity}>
                    Qty: {item.quantity}
                  </Text>
                  <Text style={styles.productPrice}>
                    Rs. {price.finalPrice * item.quantity}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* The user selects a demo payment option; no payment is taken. */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Payment Method</Text>

  {paymentMethods.map((method) => {
    const selected = paymentMethod === method;

    return (
      <TouchableOpacity
        key={method}
        style={styles.paymentOption}
        onPress={() => setPaymentMethod(method)}
        activeOpacity={0.75}
      >
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>

        <Text style={styles.paymentText}>{method}</Text>
      </TouchableOpacity>
    );
  })}
</View>

      {/* Show the assignment's subtotal, discount, and final amount. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>

        <PriceRow label="Subtotal" value={`Rs. ${subtotal}`} styles={styles} />

        <PriceRow
          label="Discount (20%)"
          value={discount > 0 ? `− Rs. ${discount}` : 'Rs. 0'}
          styles={styles}
          discount
        />

        <View style={styles.divider} />

        <PriceRow
          label="Total Payable"
          value={`Rs. ${total}`}
          styles={styles}
          total
        />

        <Text style={styles.discountRule}>
          20% discount applies when the subtotal is above Rs. 1,200.
        </Text>
      </View>

      {/* This is a demo order button; it does not process real payment. */}
      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          items.length === 0 && styles.disabledButton,
        ]}
        onPress={placeOrder}
        activeOpacity={0.85}
      >
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Reusable row for the checkout price summary.
function PriceRow({ label, value, styles, discount, total }) {
  return (
    <View style={styles.priceRow}>
      <Text
        style={[
          styles.priceLabel,
          discount && styles.discountText,
          total && styles.totalText,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.priceValue,
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
      padding: 16,
      paddingTop: 18,
      paddingBottom: 30,
    },
    header: {
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    backButton: {
      width: 38,
      height: 38,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    title: {
      color: colors.text,
      fontSize: 19,
      fontWeight: 'bold',
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 13,
      marginBottom: 12,
    },
    sectionHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    contactName: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    contactEmail: {
      color: colors.muted,
      fontSize: 11,
      marginTop: 3,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 9,
      marginTop: 4,
    },
    imageBox: {
      width: 58,
      height: 60,
      backgroundColor: colors.background,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    productImage: {
      width: '85%',
      height: '85%',
    },
    productInfo: {
      flex: 1,
      marginLeft: 10,
    },
    productName: {
      color: colors.text,
      fontSize: 11,
      fontWeight: '600',
    },
    productQuantity: {
      color: colors.muted,
      fontSize: 10,
      marginTop: 3,
    },
    productPrice: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: 'bold',
      marginTop: 3,
    },
    emptyText: {
      color: colors.muted,
      fontSize: 12,
    },
    priceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    priceLabel: {
      color: colors.muted,
      fontSize: 12,
    },
    priceValue: {
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
    discountRule: {
      color: colors.muted,
      fontSize: 10,
      lineHeight: 15,
      marginTop: 9,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 11,
    },

  paymentOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 8,
},
radio: {
  width: 19,
  height: 19,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: colors.muted,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
},
radioSelected: {
  borderColor: colors.primary,
},
radioDot: {
  width: 9,
  height: 9,
  borderRadius: 5,
  backgroundColor: colors.primary,
},
paymentText: {
  color: colors.text,
  fontSize: 12,
},

    placeOrderButton: {
      height: 49,
      backgroundColor: colors.text,
      borderRadius: 11,
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledButton: {
      opacity: 0.55,
    },
    placeOrderText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
}