import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

const OrderConfirmScreen = ({ order, onGoHome }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const orderNumber = `BW-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 5,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Checkmark animation */}
        <Animated.View
          style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.thankYou}>Thank you for your order!</Text>
          <Text style={styles.orderNumber}>Order #{orderNumber}</Text>
          <Text style={styles.confirmationNote}>
            A confirmation email will be sent to your email address.
          </Text>

          {/* Order summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            {order?.items?.map((item) => (
              <View key={item.book.id} style={styles.summaryItem}>
                <View style={[styles.summaryThumb, { backgroundColor: item.book.color }]}>
                  <Text style={styles.summaryThumbText} numberOfLines={2}>{item.book.title}</Text>
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryItemTitle} numberOfLines={2}>{item.book.title}</Text>
                  <Text style={styles.summaryItemAuthor}>{item.book.author}</Text>
                  <Text style={styles.summaryItemQtyPrice}>
                    Qty: {item.qty} · £{(item.book.price * item.qty).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.summaryDivider} />
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total Paid</Text>
              <Text style={styles.summaryTotalValue}>£{order?.total?.toFixed(2)}</Text>
            </View>
          </View>

          {/* Delivery info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🚚</Text>
              <Text style={styles.deliveryText}>Estimated delivery: 3–5 business days</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>📦</Text>
              <Text style={styles.deliveryText}>Shipping from UK/US warehouse</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.homeBtn} onPress={onGoHome}>
            <Text style={styles.homeBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1B6B2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#1B6B2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  checkIcon: { fontSize: 44, color: '#FFFFFF', fontWeight: '700' },
  thankYou: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    textAlign: 'center',
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 14,
    color: '#1B6B2F',
    fontWeight: '700',
    marginBottom: 10,
  },
  confirmationNote: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    width: '100%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 14,
  },
  summaryItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryThumb: {
    width: 50,
    height: 66,
    borderRadius: 6,
    padding: 5,
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  summaryThumbText: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summaryInfo: { flex: 1, gap: 2 },
  summaryItemTitle: { fontSize: 13, fontWeight: '700', color: '#111', lineHeight: 18 },
  summaryItemAuthor: { fontSize: 11, color: '#888' },
  summaryItemQtyPrice: { fontSize: 12, color: '#1B6B2F', fontWeight: '600', marginTop: 2 },
  summaryDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotalLabel: { fontSize: 15, fontWeight: '800', color: '#111' },
  summaryTotalValue: { fontSize: 18, fontWeight: '900', color: '#1B6B2F' },
  deliveryInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 28,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  deliveryIcon: { fontSize: 20 },
  deliveryText: { fontSize: 13, color: '#555', flex: 1 },
  homeBtn: {
    backgroundColor: '#F57C00',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 48,
    elevation: 3,
    shadowColor: '#F57C00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});

export default OrderConfirmScreen;
