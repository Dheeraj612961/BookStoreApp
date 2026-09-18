import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const Header = ({ onCartPress, onSignInPress, onSignOutPress, onSearchPress, cartCount = 0, user = null }) => {

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIconContainer}>
            <View style={styles.logoBar1} />
            <View style={styles.logoBar2} />
            <View style={styles.logoBar3} />
          </View>
          <View>
            <Text style={styles.logoText}>Book</Text>
            <Text style={styles.logoText}>Nest</Text>
          </View>
        </View>

        {/* Search Bar — tapping anywhere opens search screen */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => onSearchPress && onSearchPress('')}
          activeOpacity={0.85}
        >
          <Text style={styles.searchPlaceholder}>Search for anything</Text>
          <View style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </TouchableOpacity>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {user ? (
            <TouchableOpacity style={styles.signInButton} onPress={onSignOutPress}>
              <Text style={styles.welcomeText}>Hello, {user.name?.split(' ')[0]}</Text>
              <Text style={styles.signInText}>Sign out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signInButton} onPress={onSignInPress}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.signInText}>Sign in / Register</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
            <Text style={styles.cartIcon}>🛒</Text>
            <Text style={styles.cartText}>Cart</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1B6B2F',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  logoIconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  logoBar1: { width: 6, height: 14, backgroundColor: '#4FC3F7', borderRadius: 2 },
  logoBar2: { width: 6, height: 20, backgroundColor: '#4FC3F7', borderRadius: 2 },
  logoBar3: { width: 6, height: 10, backgroundColor: '#4FC3F7', borderRadius: 2 },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    height: 40,
    alignItems: 'center',
  },
  searchPlaceholder: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#999',
  },
  searchButton: {
    backgroundColor: '#F57C00',
    width: 44,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: { fontSize: 16 },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInButton: { alignItems: 'flex-start' },
  welcomeText: { color: '#CCCCCC', fontSize: 10 },
  signInText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  cartButton: {
    backgroundColor: '#F57C00',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
    position: 'relative',
  },
  cartIcon: { fontSize: 14 },
  cartText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});

export default Header;
