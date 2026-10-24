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

const API_URL = 'https://dummyjson.com/products?limit=0';

const SECTIONS = [
  {
    title: 'Accessories',
    cards: [
      { label: "Men's", apiCategories: ['mens-watches'] },
      { label: "Women's", apiCategories: ['womens-jewellery', 'womens-bags'] },
    ],
  },
  {
    title: 'Clothes',
    cards: [
      { label: "Men's", apiCategories: ['mens-shirts'] },
      { label: "Women's", apiCategories: ['womens-dresses'] },
    ],
  },
  {
    title: 'Makeup',
    cards: [
      { label: 'Cosmetics', apiCategories: ['beauty'] },
      { label: 'Beauty essentials', apiCategories: ['beauty'] },
    ],
  },
];

export default function CategoryScreen({ navigation }) {
  const { colors: themeColors } = useCart();
  const colors = themeColors || Colors;
  const styles = makeStyles(colors);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product pictures for the category cards.
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Could not load category pictures.');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch {
        setError('Category pictures could not load. Check your connection.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Find an API image to represent a category.
  function imageFor(apiCategories) {
    const product = products.find((item) =>
      apiCategories.includes(item.category)
    );

    return product?.thumbnail || product?.images?.[0] || null;
  }

  // Open the product screen, showing clothing options when appropriate.
  function openProducts(section, card) {
    navigation.navigate('CategoryProducts', {
      title: `${section.title} · ${card.label}`,
      apiCategories: card.apiCategories,
      showClothingOptions: section.title === 'Clothes',
    });
  }
  // Open products from every subcategory in this section.
function openAllProducts(section) {
  const allApiCategories = section.cards.reduce((categories, card) => {
    return categories.concat(card.apiCategories);
  }, []);

  navigation.navigate('CategoryProducts', {
    title: section.title,
    apiCategories: allApiCategories,
    showClothingOptions: section.title === 'Clothes',
  });
}

  function renderCard(section, card) {
    const image = imageFor(card.apiCategories);

    return (
      <TouchableOpacity
        key={`${section.title}-${card.label}`}
        style={styles.categoryCard}
        onPress={() => openProducts(section, card)}
        activeOpacity={0.85}
      >
        <View style={styles.categoryImageBox}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="image-outline" size={30} color={colors.muted} />
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardLabel}>{card.label}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
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
      {/* Back arrow, page title, and search icon. */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate('Home')}
          accessibilityLabel="Go to Home"
        >
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Categories</Text>

        <View style={styles.headerIcon}>
          <Ionicons name="search-outline" size={22} color={colors.text} />
        </View>
      </View>

      {/* Three main category shortcuts. */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <View style={styles.mainCategories}>
          {SECTIONS.map((section, index) => {
            const mainImage = imageFor(section.cards[0].apiCategories);
            const iconNames = [
              'watch-outline',
              'shirt-outline',
              'color-palette-outline',
            ];

            return (
              <TouchableOpacity
                key={section.title}
                style={styles.mainCategory}
                onPress={() => openProducts(section, section.cards[0])}
                activeOpacity={0.85}
              >
                <View style={styles.mainImageBox}>
                  {mainImage ? (
                    <Image
                      source={{ uri: mainImage }}
                      style={styles.mainImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons
                      name={iconNames[index]}
                      size={27}
                      color={colors.primary}
                    />
                  )}
                </View>
                <Text style={styles.mainCategoryLabel}>{section.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {/* Main category sections and their subcategory cards. */}
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <TouchableOpacity
              onPress={() => openAllProducts(section)}
            >
              <Text style={styles.viewAll}>View all ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            {section.cards.map((card) => renderCard(section, card))}
          </View>
        </View>
      ))}
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
      paddingHorizontal: 17,
      paddingTop: 12,
      paddingBottom: 28,
    },
    header: {
      height: 42,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    headerIcon: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    loader: {
      marginVertical: 24,
    },
    mainCategories: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    mainCategory: {
      width: '31.5%',
      alignItems: 'center',
    },
    mainImageBox: {
      width: '100%',
      height: 78,
      borderRadius: 13,
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainImage: {
      width: '88%',
      height: '88%',
    },
    mainCategoryLabel: {
      color: colors.text,
      fontSize: 11,
      fontWeight: '600',
      marginTop: 6,
    },
    section: {
      marginBottom: 17,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 9,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    viewAll: {
      color: colors.primary,
      fontSize: 11,
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48.5%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.white,
    },
    categoryImageBox: {
      height: 112,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
    },
    categoryImage: {
      width: '90%',
      height: '90%',
    },
    cardFooter: {
      minHeight: 32,
      paddingHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardLabel: {
      color: colors.text,
      fontSize: 11,
    },
    error: {
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 14,
    },
  });
}