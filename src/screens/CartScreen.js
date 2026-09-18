import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const { book, qty } = item;
  const subtotal = (book.price * qty).toFixed(2);

  return (
    <View style={styles.cartItem}>
      {/* Book Cover Thumbnail */}
      <View style={[styles.thumbnail, { backgroundColor: book.color }]}>
        <Text style={styles.thumbnailTitle} numberOfLines={3}>{book.title}</Text>
        <Text style={styles.thumbnailAuthor} numberOfLines={1}>{book.author}</Text>
      </View>

      {/* Book info */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.itemAuthor}>{book.author}</Text>
        <Text style={styles.itemPrice}>£{book.price.toFixed(2)}</Text>
      </View>

      {/* Qty controls */}
      <View style={styles.itemControls}>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQty(book.id, qty - 1)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => onUpdateQty(book.id, qty + 1)}
          >
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtotal}>£{subtotal}</Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(book.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.removeBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = ({ cartItems, user, onBack, onUpdateQty, onRemove, onClearCart, onCheckout, onGoSignIn }) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce((sum, i) => sum + i.book.price * i.qty, 0);
  const isFreeShipping = subtotal >= 10;
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert('Coupon Code', 'Please enter a coupon code.');
      return;
    }
    if (couponCode.toUpperCase() === 'BOOK10') {
      const d = parseFloat((subtotal * 0.1).toFixed(2));
      setDiscount(d);
      setCouponApplied(true);
      Alert.alert('Coupon Applied!', '10% discount has been applied.');
    } else {
      Alert.alert('Invalid Coupon', 'The coupon code you entered is not valid.');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            onClearCart();
            setCouponApplied(false);
            setDiscount(0);
            setCouponCode('');
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checking out.');
      return;
    }
    onCheckout && onCheckout();
  };

  return (
    <View style={styles.container}>
      {/* ── Top Nav ── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Cart</Text>
        <View style={styles.navRight}>
          {cartItems.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{cartItems.reduce((s, i) => s + i.qty, 0)}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Cart</Text>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add some books to get started!</Text>
            <TouchableOpacity style={styles.continueShopping} onPress={onBack}>
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {/* ── Cart Items Table ── */}
            <View style={styles.cartTable}>
              {/* Header row */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.headerProduct]}>Product</Text>
                <Text style={styles.headerCell}>Price</Text>
                <Text style={styles.headerCell}>Qty</Text>
                <Text style={styles.headerCell}>Subtotal</Text>
              </View>

              {/* Item rows */}
              {cartItems.map((item) => (
                <CartItem
                  key={item.book.id}
                  item={item}
                  onUpdateQty={onUpdateQty}
                  onRemove={onRemove}
                />
              ))}

              {/* Coupon + Cart actions */}
              <View style={styles.cartActions}>
                <View style={styles.couponRow}>
                  <TextInput
                    style={styles.couponInput}
                    placeholder="Coupon code"
                    placeholderTextColor="#AAA"
                    value={couponCode}
                    onChangeText={setCouponCode}
                    autoCapitalize="characters"
                    editable={!couponApplied}
                  />
                  <TouchableOpacity
                    style={[styles.applyCouponBtn, couponApplied && styles.appliedBtn]}
                    onPress={handleApplyCoupon}
                    disabled={couponApplied}
                  >
                    <Text style={styles.applyCouponText}>
                      {couponApplied ? '✓ Applied' : 'Apply coupon'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cartBtnsRow}>
                  <TouchableOpacity onPress={handleClearCart}>
                    <Text style={styles.clearCartText}>Clear Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ── Cart Totals ── */}
            <View style={styles.totalsCard}>
              <Text style={styles.totalsTitle}>Cart totals</Text>

              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Subtotal</Text>
                <Text style={styles.totalsValue}>£{subtotal.toFixed(2)}</Text>
              </View>

              {couponApplied && discount > 0 && (
                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, { color: '#D32F2F' }]}>Discount</Text>
                  <Text style={[styles.totalsValue, { color: '#D32F2F' }]}>-£{discount.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.totalsSection}>
                <Text style={styles.totalsSectionTitle}>Shipment</Text>
                <Text style={styles.freeShipping}>
                  {isFreeShipping ? 'Free shipping' : `Standard: £2.99`}
                </Text>
                <Text style={styles.shippingNote}>
                  Shipping options will be updated during checkout.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.calcShipping}>Calculate shipping</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>£{total.toFixed(2)}</Text>
              </View>

              {/* Login gate banner for guests */}
              {!user && (
                <View style={styles.loginGate}>
                  <Text style={styles.loginGateText}>🔒 Sign in to proceed to checkout</Text>
                  <TouchableOpacity style={styles.loginGateBtn} onPress={onGoSignIn}>
                    <Text style={styles.loginGateBtnText}>Sign In / Register</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.checkoutBtn, !user && styles.checkoutBtnDisabled]}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutBtnText}>
                  {user ? 'Proceed to checkout' : '🔒  Sign in to checkout'}
                </Text>
              </TouchableOpacity>

              {isFreeShipping && (
                <View style={styles.freeShippingBanner}>
                  <Text style={styles.freeShippingBannerText}>🚚 You qualify for free shipping!</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // ── Top Nav ──
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 64,
  },
  backArrow: {
    fontSize: 28,
    color: '#1B6B2F',
    fontWeight: '300',
    lineHeight: 32,
    marginRight: 2,
  },
  backText: {
    fontSize: 15,
    color: '#1B6B2F',
    fontWeight: '700',
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  navRight: {
    minWidth: 64,
    alignItems: 'flex-end',
  },
  countBadge: {
    backgroundColor: '#F57C00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    textAlign: 'center',
    marginVertical: 20,
  },

  // ── Empty ──
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888', marginBottom: 24, textAlign: 'center' },
  continueShopping: {
    backgroundColor: '#1B6B2F',
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  continueShoppingText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  // ── Main Content ──
  mainContent: {
    paddingHorizontal: 12,
    gap: 14,
  },

  // ── Cart Table ──
  cartTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
    flex: 1,
    textAlign: 'center',
  },
  headerProduct: {
    flex: 2.5,
    textAlign: 'left',
  },

  // ── Cart Item ──
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  thumbnail: {
    width: 62,
    height: 82,
    borderRadius: 6,
    padding: 6,
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  thumbnailTitle: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    lineHeight: 11,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  thumbnailAuthor: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 7,
  },
  itemInfo: {
    flex: 1.5,
    gap: 2,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    lineHeight: 16,
  },
  itemAuthor: {
    fontSize: 10,
    color: '#888',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B6B2F',
    marginTop: 2,
  },
  itemControls: {
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#333' },
  qtyValue: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  subtotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111',
  },
  removeBtn: {
    padding: 4,
  },
  removeBtnText: { fontSize: 18 },

  // ── Cart Actions ──
  cartActions: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  applyCouponBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  appliedBtn: {
    backgroundColor: '#1B6B2F',
  },
  applyCouponText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cartBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  clearCartText: {
    fontSize: 13,
    color: '#555',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // ── Totals Card ──
  totalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    gap: 0,
  },
  totalsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  totalsLabel: {
    fontSize: 14,
    color: '#444',
  },
  totalsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  totalsSection: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 4,
  },
  totalsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  freeShipping: {
    fontSize: 14,
    color: '#1B6B2F',
    fontWeight: '600',
  },
  shippingNote: {
    fontSize: 12,
    color: '#777',
    lineHeight: 18,
  },
  calcShipping: {
    fontSize: 12,
    color: '#1B6B2F',
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  loginGate: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
    alignItems: 'center',
    gap: 10,
  },
  loginGateText: {
    fontSize: 13,
    color: '#5D4037',
    fontWeight: '600',
    textAlign: 'center',
  },
  loginGateBtn: {
    backgroundColor: '#1B6B2F',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  loginGateBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  checkoutBtn: {
    backgroundColor: '#F57C00',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#BDBDBD',
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  freeShippingBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  freeShippingBannerText: {
    fontSize: 12,
    color: '#1B6B2F',
    fontWeight: '600',
  },
});

export default CartScreen;
