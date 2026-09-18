import React, { useState } from 'react';
import { View, StatusBar, StyleSheet, Platform, Alert } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderConfirmScreen from './src/screens/OrderConfirmScreen';
import SearchScreen from './src/screens/SearchScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44;

export default function App() {
  // ─── Auth state ───────────────────────────────────────────
  const [user, setUser] = useState(null); // null = guest, { email, name } = signed in

  // ─── Navigation ───────────────────────────────────────────
  // screen: 'home' | 'detail' | 'cart' | 'checkout' | 'confirm' | 'search' | 'signin' | 'signup'
  const [screen, setScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState('home'); // for back after auth
  const [selectedBook, setSelectedBook] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // ─── Cart state ───────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = (book, qty = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.book.id === book.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { book, qty }];
    });
  };

  const updateCartQty = (bookId, qty) => {
    setCartItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.book.id !== bookId)
        : prev.map((i) => (i.book.id === bookId ? { ...i, qty } : i))
    );
  };

  const removeFromCart = (bookId) =>
    setCartItems((prev) => prev.filter((i) => i.book.id !== bookId));

  const clearCart = () => setCartItems([]);

  // ─── Navigation helpers ───────────────────────────────────
  const navigate = (s) => setScreen(s);
  const goHome = () => { setSelectedBook(null); setScreen('home'); };
  const goDetail = (book) => { setSelectedBook(book); setScreen('detail'); };
  const goCart = () => setScreen('cart');
  const [searchParams, setSearchParams] = useState({});
  const goSearch = (params = {}) => { setSearchParams(params); setScreen('search'); };

  // Checkout gate: requires login
  const goCheckout = () => {
    if (!user) {
      setPrevScreen('cart');
      setScreen('signin');
    } else {
      setScreen('checkout');
    }
  };

  // Sign In / Sign Up navigation
  const goSignIn = (from = screen) => {
    setPrevScreen(from);
    setScreen('signin');
  };
  const goSignUp = () => setScreen('signup');

  const handleSignIn = (userData) => {
    setUser(userData);
    // Return to where they came from — if it was cart, go to checkout
    if (prevScreen === 'cart') {
      setScreen('checkout');
    } else {
      setScreen(prevScreen || 'home');
    }
  };

  const handleSignUp = (userData) => {
    setUser(userData);
    if (prevScreen === 'cart') {
      setScreen('checkout');
    } else {
      setScreen(prevScreen || 'home');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { setUser(null); goHome(); } },
    ]);
  };

  const handleOrderComplete = (order) => {
    setCompletedOrder(order);
    clearCart();
    setScreen('confirm');
  };

  // Hide green safe-area spacer on full-screen white pages
  const hideGreenTop = screen === 'confirm' || screen === 'signin' || screen === 'signup';

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {!hideGreenTop && (
        <View style={[styles.safeAreaTop, { height: STATUS_BAR_HEIGHT }]} />
      )}

      <View style={styles.screenContainer}>
        {screen === 'home' && (
          <HomeScreen
            cartCount={cartCount}
            user={user}
            onBookDetail={goDetail}
            onGoCart={goCart}
            onAddToCart={addToCart}
            onGoSearch={goSearch}
            onGoSignIn={() => goSignIn('home')}
            onSignOut={handleSignOut}
          />
        )}

        {screen === 'detail' && selectedBook && (
          <BookDetailScreen
            book={selectedBook}
            cartCount={cartCount}
            user={user}
            onBack={goHome}
            onGoCart={goCart}
            onAddToCart={addToCart}
          />
        )}

        {screen === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            user={user}
            onBack={goHome}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onCheckout={goCheckout}
            onGoSignIn={() => goSignIn('cart')}
          />
        )}

        {screen === 'checkout' && (
          <CheckoutScreen
            cartItems={cartItems}
            user={user}
            onBack={goCart}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {screen === 'confirm' && completedOrder && (
          <OrderConfirmScreen
            order={completedOrder}
            onGoHome={goHome}
          />
        )}

        {screen === 'search' && (
          <SearchScreen
            cartCount={cartCount}
            initialCategory={searchParams.initialCategory}
            initialBadge={searchParams.initialBadge}
            initialSort={searchParams.initialSort}
            onBack={goHome}
            onGoCart={goCart}
            onBookDetail={goDetail}
            onAddToCart={(book) => {
              addToCart(book, 1);
              Alert.alert('Added!', `"${book.title}" added to cart.`, [
                { text: 'OK', style: 'cancel' },
                { text: 'View Cart', onPress: goCart },
              ]);
            }}
          />
        )}

        {screen === 'signin' && (
          <SignInScreen
            onSignIn={handleSignIn}
            onGoSignUp={goSignUp}
            onBack={() => setScreen(prevScreen || 'home')}
          />
        )}

        {screen === 'signup' && (
          <SignUpScreen
            onSignUp={handleSignUp}
            onGoSignIn={() => setScreen('signin')}
            onBack={() => setScreen('signin')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1B6B2F' },
  safeAreaTop: { backgroundColor: '#1B6B2F' },
  screenContainer: { flex: 1, backgroundColor: '#FFFFFF' },
});
