import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  RefreshControl,
} from 'react-native';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import InfoBanner from '../components/InfoBanner';
import HeroBanner from '../components/HeroBanner';
import BookSections from '../components/BookSections';

const HomeScreen = ({ cartCount, user, onBookDetail, onGoCart, onAddToCart, onGoSearch, onGoSignIn, onSignOut }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleAddToCart = (book, qty = 1) => {
    onAddToCart(book, qty);
    Alert.alert(
      'Added to Cart',
      `"${book.title}" added to your cart!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: onGoCart },
      ]
    );
  };

  // Navigate to search pre-filtered by category
  const handleCategorySelect = (category) => {
    onGoSearch && onGoSearch({ initialCategory: category });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <Header
          cartCount={cartCount}
          user={user}
          onCartPress={onGoCart}
          onSearchPress={() => onGoSearch && onGoSearch({})}
          onSignInPress={onGoSignIn}
          onSignOutPress={onSignOut}
        />
        <NavBar
          onCategoryPress={handleCategorySelect}
          onWhatsNew={() => onGoSearch && onGoSearch({ initialBadge: 'Sale' })}
          onBestSellers={() => onGoSearch && onGoSearch({ initialBadge: 'Best Seller' })}
          onCoupons={() => Alert.alert('Coupons', 'Use code BOOK10 at checkout for 10% off! 🎉')}
          onTodaysDeals={() => onGoSearch && onGoSearch({ initialSort: 'Price: Low–High' })}
        />
        <InfoBanner />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1B6B2F']}
            tintColor="#1B6B2F"
          />
        }
      >
        <HeroBanner onShopNowPress={() => onGoSearch && onGoSearch({ initialBadge: 'Sale' })} />

        <BookSections
          onBookPress={handleAddToCart}
          onDetailPress={onBookDetail}
          onSeeAllPress={(section) => {
            if (section === 'Best Sellers') onGoSearch && onGoSearch({ initialBadge: 'Best Seller' });
            else onGoSearch && onGoSearch({});
          }}
        />

        <View style={styles.promoStrip}>
          <Text style={styles.promoText}>📚 Over 1 million books in BookNest</Text>
          <Text style={styles.promoSubText}>
            Free shipping on orders over £10 · 30-day returns guaranteed
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stickyHeader: {
    backgroundColor: '#1B6B2F',
    zIndex: 100,
    elevation: 6,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  promoStrip: {
    backgroundColor: '#1B6B2F',
    marginHorizontal: 14,
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  promoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  promoSubText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default HomeScreen;
