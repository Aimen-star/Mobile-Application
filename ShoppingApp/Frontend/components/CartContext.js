import React, { createContext, useContext, useState } from 'react';
import Colors from '../styling/Colors';
import { getProductPrice } from '../styling/pricing';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [registeredAccount, setRegisteredAccount] = useState(null);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // New app features. These use React state, so they reset when the app restarts.
  const [savedItems, setSavedItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [fontScale, setFontScale] = useState(1);
  const [language, setLanguage] = useState('English');

  // Shared colors let Dark Mode update screens using this context.
  const colors = darkMode
    ? {
        ...Colors,
        background: '#171513',
        white: '#252220',
        text: '#F7F3EF',
        muted: '#B8AAA0',
        border: '#49413B',
        secondary: '#57483E',
      }
    : Colors;

  // Add a product and its quantity to the cart.
  function addProductToCart(product, quantity = 1) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { ...product, quantity }];
    });
  }

  // Require login before adding a product to the cart.
  function addToCart(product, quantity = 1) {
    if (!user) {
      setPendingProduct({ ...product, quantity });
      return false;
    }

    addProductToCart(product, quantity);
    return true;
  }

  function changeQuantity(productId, amount) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  // Add or remove a product from the user's saved items.
  function toggleSavedItem(product) {
    setSavedItems((currentItems) => {
      const alreadySaved = currentItems.some((item) => item.id === product.id);

      if (alreadySaved) {
        return currentItems.filter((item) => item.id !== product.id);
      }

      return [...currentItems, product];
    });
  }

  // Save a snapshot of a successfully placed order.
  function addOrder(orderDetails) {
    const newOrder = {
      id: `VL-${Date.now()}`,
      date: new Date().toISOString(),
      ...orderDetails,
    };

    setOrders((currentOrders) => [newOrder, ...currentOrders]);
  }

  // Keep text size within a comfortable range.
  function changeFontScale(amount) {
    setFontScale((currentScale) =>
      Math.min(1.2, Math.max(0.9, currentScale + amount))
    );
  }

  function signUp(name, email, password) {
    const account = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    setRegisteredAccount(account);
    setUser({ name: account.name, email: account.email });

    if (pendingProduct) {
      addProductToCart(pendingProduct, pendingProduct.quantity || 1);
      setPendingProduct(null);
    }

    return { success: true };
  }

  // Demo login; there is no server or AsyncStorage.
  function logIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    if (
      registeredAccount &&
      (registeredAccount.email !== cleanEmail ||
        registeredAccount.password !== password)
    ) {
      return {
        success: false,
        message: 'The email or password does not match this demo account.',
      };
    }

    const account = registeredAccount
      ? {
          name: registeredAccount.name,
          email: registeredAccount.email,
        }
      : {
          name: cleanEmail.split('@')[0] || 'Shopper',
          email: cleanEmail,
        };

    setUser(account);

    if (pendingProduct) {
      addProductToCart(pendingProduct, pendingProduct.quantity || 1);
      setPendingProduct(null);
    }

    return { success: true };
  }

  function logOut() {
    setUser(null);
  }

  function toggleDarkMode() {
    setDarkMode((currentMode) => !currentMode);
  }

  const value = {
    items,
    user,
    colors,
    darkMode,
    pendingProduct,

    // Saved products and order history.
    savedItems,
    orders,
    toggleSavedItem,
    addOrder,

    // Accessibility and language settings.
    fontScale,
    changeFontScale,
    language,
    setLanguage,

    // Existing cart and account actions.
    addToCart,
    changeQuantity,
    removeFromCart,
    clearCart,
    signUp,
    logIn,
    logOut,
    toggleDarkMode,
    getProductPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }

  return context;
}