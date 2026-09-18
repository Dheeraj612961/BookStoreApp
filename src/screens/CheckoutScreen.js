import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COUNTRIES = [
  'United Kingdom (UK)',
  'United States (US)',
  'Australia',
  'Canada',
  'Germany',
  'France',
  'Ireland',
  'Netherlands',
  'Spain',
  'Italy',
  'Sweden',
  'Norway',
];

const Field = ({ label, required, children }) => (
  <View style={styles.fieldGroup}>
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {required && <Text style={styles.required}> *</Text>}
    </View>
    {children}
  </View>
);

const Input = ({ placeholder, value, onChangeText, keyboardType, maxLength, secureTextEntry, error }) => (
  <TextInput
    style={[styles.input, error && styles.inputError]}
    placeholder={placeholder}
    placeholderTextColor="#BBBBBB"
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType || 'default'}
    maxLength={maxLength}
    secureTextEntry={secureTextEntry}
    autoCorrect={false}
  />
);

const OrderItem = ({ item }) => (
  <View style={styles.orderItem}>
    <View style={[styles.orderThumb, { backgroundColor: item.book.color }]}>
      <Text style={styles.orderThumbTitle} numberOfLines={3}>{item.book.title}</Text>
    </View>
    <Text style={styles.orderItemTitle} numberOfLines={2}>{item.book.title}</Text>
    <Text style={styles.orderItemQty}>× {item.qty}</Text>
    <Text style={styles.orderItemPrice}>£{(item.book.price * item.qty).toFixed(2)}</Text>
  </View>
);

// Format card number with spaces every 4 digits
const formatCardNumber = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

// Format expiry MM/YY
const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
};

const CheckoutScreen = ({ cartItems, onBack, onOrderComplete }) => {
  // Billing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('United Kingdom (UK)');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Payment
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UI state
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  const subtotal = cartItems.reduce((s, i) => s + i.book.price * i.qty, 0);
  const isFreeShipping = subtotal >= 10;
  const shipping = isFreeShipping ? 0 : 2.99;
  const total = subtotal + shipping;

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = true;
    if (!lastName.trim()) e.lastName = true;
    if (!street1.trim()) e.street1 = true;
    if (!city.trim()) e.city = true;
    if (!postcode.trim()) e.postcode = true;
    if (!email.trim() || !email.includes('@')) e.email = true;
    if (!cardHolder.trim()) e.cardHolder = true;
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = true;
    if (expiry.length < 5) e.expiry = true;
    if (cvv.length < 3) e.cvv = true;
    return e;
  };

  const handlePlaceOrder = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      Alert.alert('Missing Information', 'Please fill in all required fields correctly.');
      return;
    }
    setErrors({});

    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, speed: 50 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();

    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      onOrderComplete && onOrderComplete({ total, items: cartItems });
    }, 1800);
  };

  // Detect card type from first digit
  const getCardType = () => {
    const n = cardNumber.replace(/\s/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (n.startsWith('5') || n.startsWith('2')) return 'MC';
    if (n.startsWith('3')) return 'AMEX';
    return null;
  };
  const cardType = getCardType();

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Cart</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Checkout</Text>
        <View style={{ minWidth: 64 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Billing Details ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Billing details</Text>
          </View>

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Field label="First name" required>
                <Input
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Last name" required>
                <Input
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                />
              </Field>
            </View>
          </View>

          <Field label="Company name (optional)">
            <Input value={company} onChangeText={setCompany} />
          </Field>

          <Field label="Country / Region" required>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => setCountryModalVisible(true)}
            >
              <Text style={styles.selectText}>{country}</Text>
              <Text style={styles.selectArrow}>▾</Text>
            </TouchableOpacity>
          </Field>

          <Field label="Street address" required>
            <Input
              placeholder="House number and street name"
              value={street1}
              onChangeText={setStreet1}
              error={errors.street1}
            />
            <View style={{ height: 8 }} />
            <Input
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={street2}
              onChangeText={setStreet2}
            />
          </Field>

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <Field label="Town / City" required>
                <Input
                  value={city}
                  onChangeText={setCity}
                  error={errors.city}
                />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Postcode" required>
                <Input
                  value={postcode}
                  onChangeText={setPostcode}
                  error={errors.postcode}
                />
              </Field>
            </View>
          </View>

          <Field label="Phone">
            <Input
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </Field>

          <Field label="Email address" required>
            <Input
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
          </Field>
        </View>

        {/* ── Your Order ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Your order</Text>
          </View>

          <View style={styles.orderCard}>
            {/* Header */}
            <View style={styles.orderTableHeader}>
              <Text style={[styles.orderHeaderCell, { flex: 3 }]}>Product</Text>
              <Text style={styles.orderHeaderCell}>Subtotal</Text>
            </View>

            {/* Items */}
            {cartItems.map((item) => (
              <OrderItem key={item.book.id} item={item} />
            ))}

            <View style={styles.orderDivider} />

            {/* Shipment */}
            <View style={styles.orderRow}>
              <Text style={styles.orderRowLabel}>Shipment</Text>
              <Text style={styles.orderRowShipping}>
                {isFreeShipping ? 'Free shipping' : `£${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={styles.orderDivider} />

            {/* Total */}
            <View style={styles.orderRow}>
              <Text style={styles.orderTotalLabel}>Total</Text>
              <Text style={styles.orderTotalValue}>£{total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* ── Payment ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>Payment</Text>
          </View>

          <View style={styles.paymentCard}>
            {/* Card type header */}
            <View style={styles.paymentTypeRow}>
              <View style={styles.cardIconBlue} />
              <Text style={styles.paymentTypeLabel}>Credit Card</Text>
              <View style={styles.cardBrandRow}>
                <View style={[styles.cardBrandChip, { backgroundColor: '#1A1F71' }]}>
                  <Text style={styles.cardBrandText}>VISA</Text>
                </View>
                <View style={[styles.cardBrandChip, { backgroundColor: '#EB001B' }]}>
                  <Text style={styles.cardBrandText}>MC</Text>
                </View>
                <View style={[styles.cardBrandChip, { backgroundColor: '#2E77BC' }]}>
                  <Text style={styles.cardBrandText}>AMEX</Text>
                </View>
              </View>
            </View>

            <Field label="Cardholder name" required>
              <Input
                placeholder="Full name on card"
                value={cardHolder}
                onChangeText={setCardHolder}
                error={errors.cardHolder}
              />
            </Field>

            <Field label="Card number" required>
              <View style={[styles.cardNumberContainer, errors.cardNumber && styles.inputError]}>
                <TextInput
                  style={styles.cardNumberInput}
                  placeholder="1234 1234 1234 1234"
                  placeholderTextColor="#BBB"
                  value={cardNumber}
                  onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                  keyboardType="number-pad"
                  maxLength={19}
                />
                {cardType && (
                  <View style={[styles.detectedCardChip,
                    cardType === 'VISA' ? { backgroundColor: '#1A1F71' } :
                    cardType === 'MC' ? { backgroundColor: '#EB001B' } :
                    { backgroundColor: '#2E77BC' }
                  ]}>
                    <Text style={styles.detectedCardText}>{cardType}</Text>
                  </View>
                )}
              </View>
            </Field>

            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Field label="Expiry date" required>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={(v) => setExpiry(formatExpiry(v))}
                    keyboardType="number-pad"
                    maxLength={5}
                    error={errors.expiry}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="CVV" required>
                  <Input
                    placeholder="•••"
                    value={cvv}
                    onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    error={errors.cvv}
                  />
                </Field>
              </View>
            </View>

            <View style={styles.secureRow}>
              <Text style={styles.secureIcon}>🔒</Text>
              <Text style={styles.secureText}>
                Your payment information is encrypted and secure
              </Text>
            </View>
          </View>
        </View>

        {/* ── Place Order ── */}
        <View style={styles.placeOrderSection}>
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.placeOrderBtn, placing && styles.placingBtn]}
              onPress={handlePlaceOrder}
              disabled={placing}
            >
              <Text style={styles.placeOrderText}>
                {placing ? '⏳  Processing...' : `Place Order · £${total.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.termsText}>
            By placing your order you agree to our Terms & Conditions and Privacy Policy.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={countryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Country / Region</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {COUNTRIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.countryOption,
                    c === country && styles.countryOptionSelected,
                  ]}
                  onPress={() => {
                    setCountry(c);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.countryOptionText,
                    c === country && styles.countryOptionTextSelected,
                  ]}>{c}</Text>
                  {c === country && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6F8' },

  // Top Nav
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
  backBtn: { flexDirection: 'row', alignItems: 'center', minWidth: 64 },
  backArrow: { fontSize: 28, color: '#1B6B2F', fontWeight: '300', lineHeight: 32, marginRight: 2 },
  backText: { fontSize: 15, color: '#1B6B2F', fontWeight: '700' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#111' },

  scroll: { flex: 1 },
  scrollContent: { paddingVertical: 16, paddingHorizontal: 12, gap: 16 },

  // Section
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionAccent: {
    width: 4,
    height: 20,
    backgroundColor: '#1B6B2F',
    borderRadius: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111' },

  // Row layout
  row2: { flexDirection: 'row', gap: 12 },

  // Field
  fieldGroup: { marginBottom: 14 },
  fieldLabelRow: { flexDirection: 'row', marginBottom: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#333' },
  required: { fontSize: 13, color: '#D32F2F', fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#FAFAFA',
  },
  inputError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },

  // Select (Country)
  selectField: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  selectText: { flex: 1, fontSize: 14, color: '#333' },
  selectArrow: { fontSize: 14, color: '#888' },

  // Order card
  orderCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  orderHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  orderThumb: {
    width: 46,
    height: 62,
    borderRadius: 5,
    padding: 5,
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
  orderThumbTitle: {
    color: '#FFF',
    fontSize: 7,
    fontWeight: '800',
    lineHeight: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  orderItemTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: '#111', lineHeight: 18 },
  orderItemQty: { fontSize: 13, color: '#777', fontWeight: '600', marginHorizontal: 8 },
  orderItemPrice: { fontSize: 13, fontWeight: '800', color: '#111', minWidth: 56, textAlign: 'right' },
  orderDivider: { height: 1, backgroundColor: '#F0F0F0' },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  orderRowLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  orderRowShipping: { fontSize: 14, color: '#1B6B2F', fontWeight: '600' },
  orderTotalLabel: { fontSize: 15, fontWeight: '800', color: '#111' },
  orderTotalValue: { fontSize: 18, fontWeight: '900', color: '#111' },

  // Payment
  paymentCard: {
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  paymentTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  cardIconBlue: {
    width: 32,
    height: 22,
    backgroundColor: '#3B5FD4',
    borderRadius: 4,
  },
  paymentTypeLabel: { fontSize: 14, fontWeight: '700', color: '#111', flex: 1 },
  cardBrandRow: { flexDirection: 'row', gap: 5 },
  cardBrandChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBrandText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  cardNumberInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    letterSpacing: 1,
  },
  detectedCardChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  detectedCardText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#F0FAF3',
    borderRadius: 8,
    padding: 10,
  },
  secureIcon: { fontSize: 16 },
  secureText: { flex: 1, fontSize: 11, color: '#555', lineHeight: 16 },

  // Place Order
  placeOrderSection: { gap: 12 },
  placeOrderBtn: {
    backgroundColor: '#1B6B2F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1B6B2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  placingBtn: { backgroundColor: '#555' },
  placeOrderText: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
  termsText: { fontSize: 11, color: '#999', textAlign: 'center', lineHeight: 16 },

  // Country Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 12 },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  countryOptionSelected: { backgroundColor: '#F0FAF3' },
  countryOptionText: { flex: 1, fontSize: 14, color: '#333' },
  countryOptionTextSelected: { color: '#1B6B2F', fontWeight: '700' },
  checkmark: { fontSize: 16, color: '#1B6B2F', fontWeight: '800' },
});

export default CheckoutScreen;
