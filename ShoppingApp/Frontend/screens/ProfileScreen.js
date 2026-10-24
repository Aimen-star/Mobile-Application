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
import { useCart } from '../components/CartContext';

const PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80';

// Simple translations for the labels shown on this Profile screen.
const LABELS = {
  English: {
    account: 'Account',
    orders: 'My Orders',
    addresses: 'Addresses',
    payments: 'Payment Methods',
    saved: 'Saved Items',
    settings: 'Settings',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    textSize: 'Text Size',
    language: 'Language',
    help: 'Help & Support',
    logout: 'Log Out',
    login: 'Log In or Sign Up',
    emptyOrders: 'No orders yet.',
    emptySaved: 'No saved items yet.',
  },
  Urdu: {
    account: 'اکاؤنٹ',
    orders: 'میرے آرڈرز',
    addresses: 'پتے',
    payments: 'ادائیگی کے طریقے',
    saved: 'محفوظ اشیاء',
    settings: 'ترتیبات',
    notifications: 'اطلاعات',
    darkMode: 'ڈارک موڈ',
    textSize: 'متن کا سائز',
    language: 'زبان',
    help: 'مدد اور معاونت',
    logout: 'لاگ آؤٹ',
    login: 'لاگ ان یا سائن اپ',
    emptyOrders: 'ابھی کوئی آرڈر نہیں۔',
    emptySaved: 'ابھی کوئی محفوظ شے نہیں۔',
  },
  Arabic: {
    account: 'الحساب',
    orders: 'طلباتي',
    addresses: 'العناوين',
    payments: 'طرق الدفع',
    saved: 'العناصر المحفوظة',
    settings: 'الإعدادات',
    notifications: 'الإشعارات',
    darkMode: 'الوضع الداكن',
    textSize: 'حجم النص',
    language: 'اللغة',
    help: 'المساعدة والدعم',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول أو إنشاء حساب',
    emptyOrders: 'لا توجد طلبات بعد.',
    emptySaved: 'لا توجد عناصر محفوظة بعد.',
  },
};

export default function ProfileScreen({ navigation }) {
  const {
    user,
    colors: themeColors,
    darkMode,
    toggleDarkMode,
    logOut,
    savedItems = [],
    orders = [],
    toggleSavedItem,
    fontScale = 1,
    changeFontScale,
    language = 'English',
    setLanguage,
  } = useCart();

  const colors = themeColors || Colors;
  const styles = createStyles(colors, fontScale);
  const labels = LABELS[language] || LABELS.English;

  const [showOrders, setShowOrders] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  function showComingSoon(label) {
    Alert.alert(label, `${label} will be available in a future update.`);
  }

  // Let the user choose one of the three available languages.
  function chooseLanguage() {
    Alert.alert('Choose Language', 'Select a language for Profile labels.', [
      { text: 'English', onPress: () => setLanguage('English') },
      { text: 'اردو', onPress: () => setLanguage('Urdu') },
      { text: 'العربية', onPress: () => setLanguage('Arabic') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  // Change the app's shared font-size setting in small steps.
  function adjustTextSize(amount) {
    if (changeFontScale) {
      changeFontScale(amount);
    }
  }

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        onPress: () => {
          logOut();
          navigation.navigate('Home');
        },
      },
    ]);
  }

  // Shared layout for the simple settings rows.
  function renderRow(icon, label, onPress, rightText) {
    return (
      <TouchableOpacity
        key={label}
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons name={icon} size={17} color={colors.muted} />
        <Text style={styles.rowLabel}>{label}</Text>
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
        <Ionicons name="chevron-forward" size={15} color={colors.muted} />
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile header uses the current signed-in user's name and email. */}
      <View style={styles.accountHeader}>
        <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />

        <View style={styles.accountInfo}>
          <Text style={styles.name}>
            {user?.name || 'Welcome to Veylora'}
          </Text>
          <Text style={styles.email}>
            {user?.email || 'Log in to view your profile'}
          </Text>
        </View>

        {user ? (
          <TouchableOpacity
            onPress={() => showComingSoon('Edit profile')}
            accessibilityLabel="Edit profile"
          >
            <Ionicons name="create-outline" size={19} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!user && (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={styles.loginButtonText}>{labels.login}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>{labels.account}</Text>

      {/* Tap to expand and review orders placed during this app session. */}
      {renderRow('receipt-outline', labels.orders, () =>
        setShowOrders((visible) => !visible)
      )}
      {showOrders && (
        <View style={styles.expandedBox}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>{labels.emptyOrders}</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.historyCard}>
                <View style={styles.historyHeading}>
                  <Text style={styles.historyTitle}>Order {order.id}</Text>
                  <Text style={styles.historyTotal}>Rs. {order.total}</Text>
                </View>
                <Text style={styles.historyDetails}>
                  {order.items?.length || 0} product(s) ·{' '}
                  {order.date ? new Date(order.date).toLocaleDateString() : ''}
                </Text>
                {order.items?.map((item, index) => (
                  <Text
                    key={`${order.id}-${item.id}-${index}`}
                    style={styles.historyDetails}
                    numberOfLines={1}
                  >
                    {item.title} × {item.quantity}
                  </Text>
                ))}
                {/* Show the payment option saved with this order. */}
                {order.paymentMethod ? (
                <Text style={styles.historyDetails}>
                Payment: {order.paymentMethod}
                </Text>
                 ) : null} 
              </View>
            ))
          )}
        </View>
      )}

      {renderRow('location-outline', labels.addresses, () =>
        showComingSoon(labels.addresses)
      )}
      {/* Expand to show demo options; this list does not process payments. */}
{renderRow('card-outline', labels.payments, () =>
  setShowPaymentMethods((visible) => !visible)
)}

{showPaymentMethods && (
  <View style={styles.expandedBox}>
    {[
      { name: 'Cash on Delivery', icon: 'cash-outline' },
      { name: 'JazzCash', icon: 'wallet-outline' },
      { name: 'Easypaisa', icon: 'wallet-outline' },
      { name: 'Bank Transfer', icon: 'business-outline' },
    ].map((method) => (
      <View key={method.name} style={styles.paymentMethodRow}>
        <Ionicons name={method.icon} size={18} color={colors.primary} />
        <Text style={styles.paymentMethodText}>{method.name}</Text>
      </View>
    ))}
  </View>
)}

      {/* Tap to expand saved products; tap a heart to remove one. */}
      {renderRow('heart-outline', labels.saved, () =>
        setShowSavedItems((visible) => !visible)
      )}
      {showSavedItems && (
        <View style={styles.expandedBox}>
          {savedItems.length === 0 ? (
            <Text style={styles.emptyText}>{labels.emptySaved}</Text>
          ) : (
            savedItems.map((product) => {
              const image =
                product.image || product.thumbnail || product.images?.[0];

              return (
                <View key={product.id} style={styles.savedCard}>
                  <View style={styles.savedImageBox}>
                    {image ? (
                      <Image
                        source={{ uri: image }}
                        style={styles.savedImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Ionicons
                        name="image-outline"
                        size={22}
                        color={colors.muted}
                      />
                    )}
                  </View>

                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text style={styles.savedPrice}>
                      Rs. {product.price}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleSavedItem?.(product)}
                    accessibilityLabel="Remove saved item"
                  >
                    <Ionicons
                      name="heart"
                      size={21}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      )}

      <Text style={[styles.sectionTitle, styles.settingsHeading]}>
        {labels.settings}
      </Text>

      {renderRow('notifications-outline', labels.notifications, () =>
        showComingSoon(labels.notifications)
      )}

      {/* Dark Mode updates all screens that use the shared theme colors. */}
      <View style={styles.row}>
        <Ionicons name="moon-outline" size={17} color={colors.muted} />
        <Text style={styles.rowLabel}>{labels.darkMode}</Text>
        <TouchableOpacity
          style={[styles.modeSwitch, darkMode && styles.modeSwitchOn]}
          onPress={toggleDarkMode}
          accessibilityRole="switch"
          accessibilityState={{ checked: Boolean(darkMode) }}
        >
          <View style={[styles.modeThumb, darkMode && styles.modeThumbOn]} />
        </TouchableOpacity>
      </View>

      {/* A− and A+ adjust the shared font-size value. */}
      <View style={styles.row}>
        <Ionicons name="text-outline" size={17} color={colors.muted} />
        <Text style={styles.rowLabel}>{labels.textSize}</Text>

        <TouchableOpacity
          style={styles.sizeButton}
          onPress={() => adjustTextSize(-0.1)}
          accessibilityLabel="Decrease text size"
        >
          <Text style={styles.sizeButtonText}>A−</Text>
        </TouchableOpacity>

        <View style={styles.sizeMeter}>
          {[0, 1, 2, 3].map((step) => (
            <View
              key={step}
              style={[
                styles.sizeSegment,
                fontScale >= 0.9 + step * 0.1 && styles.sizeSegmentActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.sizeButton}
          onPress={() => adjustTextSize(0.1)}
          accessibilityLabel="Increase text size"
        >
          <Text style={styles.sizeButtonText}>A+</Text>
        </TouchableOpacity>
      </View>

      {renderRow('globe-outline', labels.language, chooseLanguage, language)}

      <View style={styles.extraSpace} />

      {renderRow('help-circle-outline', labels.help, () =>
        showComingSoon(labels.help)
      )}

      {user ? (
        <TouchableOpacity
          style={styles.row}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={17} color={colors.primary} />
          <Text style={styles.logoutLabel}>{labels.logout}</Text>
          <Ionicons name="chevron-forward" size={15} color={colors.muted} />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.version}>Veylora v1.0.0</Text>
    </ScrollView>
  );
}

function createStyles(colors, fontScale) {
  // Apply the selected text scale to Profile screen text sizes.
  const textSize = (baseSize) => baseSize * fontScale;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 18,
      paddingTop: 24,
      paddingBottom: 28,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 22,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.secondary,
    },
    accountInfo: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      color: colors.text,
      fontSize: textSize(14),
      fontWeight: 'bold',
    },
    email: {
      color: colors.muted,
      fontSize: textSize(11),
      marginTop: 4,
    },
    loginButton: {
      alignItems: 'center',
      backgroundColor: colors.text,
      borderRadius: 10,
      paddingVertical: 12,
      marginBottom: 20,
    },
    loginButtonText: {
      color: colors.white,
      fontSize: textSize(13),
      fontWeight: '600',
    },
    sectionTitle: {
      color: colors.text,
      fontSize: textSize(14),
      fontWeight: 'bold',
      marginBottom: 4,
    },
    settingsHeading: {
      marginTop: 20,
    },
    row: {
      minHeight: 43,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowLabel: {
      flex: 1,
      color: colors.text,
      fontSize: textSize(12),
      marginLeft: 10,
    },
    rightText: {
      color: colors.muted,
      fontSize: textSize(10),
      marginRight: 9,
    },
    modeSwitch: {
      width: 42,
      height: 24,
      borderRadius: 12,
      padding: 3,
      justifyContent: 'center',
      backgroundColor: colors.border,
    },
    modeSwitchOn: {
      backgroundColor: colors.primary,
    },
    modeThumb: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.white,
    },
    modeThumbOn: {
      alignSelf: 'flex-end',
    },
    sizeButton: {
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    sizeButtonText: {
      color: colors.primary,
      fontSize: textSize(12),
      fontWeight: 'bold',
    },
    sizeMeter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    sizeSegment: {
      width: 9,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginHorizontal: 1,
    },
    sizeSegmentActive: {
      backgroundColor: colors.primary,
    },
    expandedBox: {
      backgroundColor: colors.white,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      padding: 10,
    },
    emptyText: {
      color: colors.muted,
      fontSize: textSize(12),
      paddingVertical: 5,
    },
    historyCard: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      paddingVertical: 9,
    },
    historyHeading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    historyTitle: {
      color: colors.text,
      fontSize: textSize(11),
      fontWeight: 'bold',
    },
    historyTotal: {
      color: colors.primary,
      fontSize: textSize(11),
      fontWeight: 'bold',
    },
    historyDetails: {
      color: colors.muted,
      fontSize: textSize(10),
      marginTop: 4,
    },
    savedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 7,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    savedImageBox: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    savedImage: {
      width: '85%',
      height: '85%',
    },
    savedInfo: {
      flex: 1,
      marginHorizontal: 10,
    },
    savedName: {
      color: colors.text,
      fontSize: textSize(11),
      fontWeight: '600',
    },
    savedPrice: {
      color: colors.primary,
      fontSize: textSize(10),
      marginTop: 4,
    },
    extraSpace: {
      height: 18,
    },
    logoutLabel: {
      flex: 1,
      color: colors.primary,
      fontSize: textSize(12),
      marginLeft: 10,
    },
    version: {
      color: colors.muted,
      fontSize: textSize(10),
      textAlign: 'center',
      marginTop: 24,
    },
    paymentMethodRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 9,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
},
paymentMethodText: {
  color: colors.text,
  fontSize: textSize(11),
  marginLeft: 10,
},
  });
}