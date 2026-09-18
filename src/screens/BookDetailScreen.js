import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Seed reviews per book ────────────────────────────────────────────────────
const SEED_REVIEWS = {
  '1': [
    { id: 'r1', name: 'Sarah M.', avatar: 'S', rating: 5, date: '12 Mar 2024', review: 'Absolutely gripping from start to finish! Patterson at his best — the plot twists kept me up all night.' },
    { id: 'r2', name: 'James T.', avatar: 'J', rating: 4, date: '8 Mar 2024', review: 'A fast-paced thriller with a believable protagonist. The ending was slightly predictable but still very enjoyable.' },
    { id: 'r3', name: 'Laura K.', avatar: 'L', rating: 4, date: '2 Feb 2024', review: 'Great holiday read. Easy to follow and hard to put down. Would recommend to any thriller fan.' },
  ],
  '2': [
    { id: 'r1', name: 'Chef Paolo', avatar: 'P', rating: 5, date: '20 Jan 2024', review: 'These recipes are genuinely achievable at home. The pasta section alone is worth the price of the book.' },
    { id: 'r2', name: 'Emma R.', avatar: 'E', rating: 5, date: '15 Jan 2024', review: 'Beautiful photography, clear instructions, and the most delicious risotto recipe I have ever tried.' },
  ],
  '3': [
    { id: 'r1', name: 'Mike L.', avatar: 'M', rating: 5, date: '10 Feb 2024', review: 'Cannot believe the twist at the end! Harlan Coben is a master of the genre. Read it in two sittings.' },
    { id: 'r2', name: 'Priya S.', avatar: 'P', rating: 4, date: '5 Feb 2024', review: 'Really well constructed mystery. The characters feel very real and the pacing is excellent throughout.' },
    { id: 'r3', name: 'Dan W.', avatar: 'D', rating: 5, date: '1 Feb 2024', review: 'My first Harlan Coben and definitely not my last. Absolutely brilliant writing.' },
  ],
  'b1': [
    { id: 'r1', name: 'Rachel G.', avatar: 'R', rating: 5, date: '15 Oct 2023', review: 'This book genuinely changed how I approach every daily habit. The 1% better every day concept is life-changing.' },
    { id: 'r2', name: 'Tom B.', avatar: 'T', rating: 5, date: '10 Oct 2023', review: 'Clear, actionable and backed by real science. I have recommended this to everyone I know.' },
    { id: 'r3', name: 'Amy C.', avatar: 'A', rating: 4, date: '3 Oct 2023', review: 'Very practical advice, though some parts felt repetitive. Still a must-read for personal development.' },
    { id: 'r4', name: 'Rohit M.', avatar: 'R', rating: 5, date: '25 Sep 2023', review: 'Hands down the best self-help book I have ever read. The habit stacking technique alone is brilliant.' },
  ],
  'b2': [
    { id: 'r1', name: 'Lena F.', avatar: 'L', rating: 5, date: '12 Nov 2023', review: 'Changed my perspective on money entirely. The stories are fascinating and the lessons are timeless.' },
    { id: 'r2', name: 'Chris D.', avatar: 'C', rating: 4, date: '8 Nov 2023', review: 'Insightful and surprisingly entertaining for a finance book. Very well written with great anecdotes.' },
  ],
  'b3': [
    { id: 'r1', name: 'Fatima A.', avatar: 'F', rating: 5, date: '20 Dec 2023', review: 'One of those rare books that fundamentally shifts how you see the world. Cannot recommend enough.' },
    { id: 'r2', name: 'Oliver P.', avatar: 'O', rating: 5, date: '14 Dec 2023', review: 'Brilliantly researched and beautifully written. History has never felt so relevant.' },
    { id: 'r3', name: 'Yuki T.', avatar: 'Y', rating: 4, date: '5 Dec 2023', review: 'Dense at times but worth every page. Harari has a gift for making complex ideas accessible.' },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StarRating = ({ rating, reviewCount }) => {
  const full = Math.floor(rating);
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.star, { color: i <= full ? '#FFB800' : '#DDD' }]}>★</Text>
      ))}
      <Text style={styles.ratingNumber}>{rating}</Text>
      {reviewCount != null && (
        <Text style={styles.reviewCount}>({reviewCount.toLocaleString()} reviews)</Text>
      )}
    </View>
  );
};

const InteractiveStars = ({ value, onChange }) => (
  <View style={styles.interactiveStarRow}>
    {[1, 2, 3, 4, 5].map((i) => (
      <TouchableOpacity key={i} onPress={() => onChange(i)} hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}>
        <Text style={[styles.interactiveStar, { color: i <= value ? '#FFB800' : '#DDD' }]}>★</Text>
      </TouchableOpacity>
    ))}
    <Text style={styles.interactiveStarLabel}>
      {value === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
    </Text>
  </View>
);

const RatingBar = ({ stars, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.ratingBarRow}>
      <Text style={styles.ratingBarLabel}>{stars}★</Text>
      <View style={styles.ratingBarTrack}>
        <View style={[styles.ratingBarFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.ratingBarCount}>{count}</Text>
    </View>
  );
};

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{review.avatar}</Text>
      </View>
      <View style={styles.reviewMeta}>
        <Text style={styles.reviewerName}>{review.name}</Text>
        <View style={styles.reviewStarRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Text key={i} style={[styles.reviewStar, { color: i <= review.rating ? '#FFB800' : '#DDD' }]}>★</Text>
          ))}
        </View>
      </View>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
    <Text style={styles.reviewText}>{review.review}</Text>
  </View>
);

const FeatureRow = ({ label, value, last }) => (
  <View style={[styles.featureRow, last && styles.featureRowLast]}>
    <Text style={styles.featureLabel}>{label}</Text>
    <Text style={styles.featureValue}>{value}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const BookDetailScreen = ({ book, cartCount, onBack, onGoCart, onAddToCart, user }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const cartBtnScale = useRef(new Animated.Value(1)).current;

  // Reviews state
  const [reviews, setReviews] = useState(SEED_REVIEWS[book?.id] || []);
  const [writeModalVisible, setWriteModalVisible] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  if (!book) return null;

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;
  const savings = book.originalPrice
    ? (book.originalPrice - book.price).toFixed(2)
    : null;

  // Compute rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : book.rating;

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.spring(cartBtnScale, { toValue: 0.93, useNativeDriver: true, speed: 50 }),
      Animated.spring(cartBtnScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
    onAddToCart && onAddToCart(book, quantity);
    setAddedToCart(true);
    Alert.alert('✓ Added to Cart', `"${book.title}" (x${quantity}) added!`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: onGoCart },
    ]);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleSubmitReview = () => {
    if (myRating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting.'); return;
    }
    if (myReview.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write at least 10 characters in your review.'); return;
    }
    setReviewSubmitting(true);
    setTimeout(() => {
      const newReview = {
        id: `u${Date.now()}`,
        name: user?.name || 'Anonymous',
        avatar: (user?.name || 'A')[0].toUpperCase(),
        rating: myRating,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        review: myReview.trim(),
      };
      setReviews((prev) => [newReview, ...prev]);
      setMyRating(0);
      setMyReview('');
      setReviewSubmitting(false);
      setWriteModalVisible(false);
      Alert.alert('✓ Review Submitted', 'Thank you for your review!');
    }, 800);
  };

  const features = [
    book.isbn10 && { label: 'ISBN-10:', value: book.isbn10 },
    book.isbn13 && { label: 'ISBN-13:', value: book.isbn13 },
    book.publisher && { label: 'Publisher:', value: book.publisher },
    book.publicationDate && { label: 'Publication date:', value: book.publicationDate },
    book.language && { label: 'Language:', value: book.language },
    book.dimensions && { label: 'Dimensions:', value: book.dimensions },
    book.printLength && { label: 'Print length:', value: book.printLength },
  ].filter(Boolean);

  return (
    <View style={styles.container}>
      {/* ── Top Nav ── */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <View style={styles.breadcrumbRow}>
          <Text style={styles.breadcrumbMuted} numberOfLines={1}>{book.category || 'Books'}</Text>
          <Text style={styles.breadcrumbSep}> › </Text>
          <Text style={styles.breadcrumbActive} numberOfLines={1}>{book.title}</Text>
        </View>
        <TouchableOpacity style={styles.cartNavBtn} onPress={onGoCart} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.cartNavIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartNavBadge}>
              <Text style={styles.cartNavBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Book Cover */}
        <View style={styles.coverSection}>
          <View style={[styles.bookCover, { backgroundColor: book.color }]}>
            {discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
            <Text style={styles.coverCategory}>{book.category?.toUpperCase()}</Text>
            <Text style={styles.coverTitle} numberOfLines={4}>{book.title}</Text>
            <Text style={styles.coverAuthor}>{book.author}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.categoryTag}>{book.category}</Text>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.currentPrice}>£{book.price.toFixed(2)}</Text>
          <View style={styles.priceMetaRow}>
            {book.originalPrice && <Text style={styles.originalPrice}>£{book.originalPrice.toFixed(2)}</Text>}
            {savings && <Text style={styles.saveText}>Save: £{savings}</Text>}
            <Text style={styles.stockText}>✓ In stock</Text>
          </View>
          {book.rating != null && <StarRating rating={Number(avgRating)} reviewCount={reviews.length} />}

          <View style={styles.divider} />

          {/* Quantity */}
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.qtyControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: cartBtnScale }] }}>
            <TouchableOpacity style={[styles.addToCartBtn, addedToCart && styles.addedBtn]} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>{addedToCart ? '✓ Added to Cart!' : '🛒  Add to Cart'}</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.buyNowBtn} onPress={() => Alert.alert('Buy Now', `Proceeding to checkout for "${book.title}"`)}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Features table */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresTable}>
            {features.map((f, i) => (
              <FeatureRow key={f.label} label={f.label} value={f.value} last={i === features.length - 1} />
            ))}
          </View>

          {book.description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{book.description}</Text>
            </>
          )}

          {/* Delivery */}
          <View style={styles.deliveryBox}>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🚚</Text>
              <View>
                <Text style={styles.deliveryTitle}>Free Delivery</Text>
                <Text style={styles.deliverySub}>Orders over £10 · UK & US warehouses</Text>
              </View>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryIcon}>🔄</Text>
              <View>
                <Text style={styles.deliveryTitle}>30-Day Returns</Text>
                <Text style={styles.deliverySub}>Full money-back guarantee</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Reviews & Ratings ── */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsTitleRow}>
            <Text style={styles.reviewsTitle}>Reviews & Ratings</Text>
            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => {
                if (!user) {
                  Alert.alert('Sign In Required', 'Please sign in to write a review.');
                } else {
                  setWriteModalVisible(true);
                }
              }}
            >
              <Text style={styles.writeReviewBtnText}>+ Write a Review</Text>
            </TouchableOpacity>
          </View>

          {/* Rating summary */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingSummaryLeft}>
              <Text style={styles.bigRating}>{avgRating}</Text>
              <View style={styles.bigStarRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Text key={i} style={[styles.bigStar, { color: i <= Math.round(avgRating) ? '#FFB800' : '#DDD' }]}>★</Text>
                ))}
              </View>
              <Text style={styles.totalReviews}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.ratingSummaryRight}>
              {ratingCounts.map(({ stars, count }) => (
                <RatingBar key={stars} stars={stars} count={count} total={reviews.length} />
              ))}
            </View>
          </View>

          {/* Individual reviews */}
          {reviews.length === 0 ? (
            <View style={styles.noReviews}>
              <Text style={styles.noReviewsIcon}>💬</Text>
              <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
            </View>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}

          <View style={{ height: 16 }} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Write Review Modal ── */}
      <Modal visible={writeModalVisible} transparent animationType="slide" onRequestClose={() => setWriteModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Write a Review</Text>
            <Text style={styles.modalBookTitle} numberOfLines={1}>{book.title}</Text>

            <Text style={styles.modalLabel}>Your Rating</Text>
            <InteractiveStars value={myRating} onChange={setMyRating} />

            <Text style={styles.modalLabel}>Your Review</Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your thoughts about this book..."
              placeholderTextColor="#BBBBBB"
              value={myReview}
              onChangeText={setMyReview}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={600}
            />
            <Text style={styles.charCount}>{myReview.length}/600</Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setWriteModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, reviewSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                <Text style={styles.modalSubmitText}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  topNav: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#E8E8E8',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, gap: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', paddingRight: 6, minWidth: 64 },
  backArrow: { fontSize: 28, color: '#1B6B2F', fontWeight: '300', lineHeight: 32, marginRight: 2 },
  backText: { fontSize: 15, color: '#1B6B2F', fontWeight: '700' },
  breadcrumbRow: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  breadcrumbMuted: { fontSize: 12, color: '#888', flexShrink: 1 },
  breadcrumbSep: { fontSize: 12, color: '#CCC', marginHorizontal: 2 },
  breadcrumbActive: { fontSize: 12, color: '#333', fontWeight: '600', flexShrink: 2 },
  cartNavBtn: { position: 'relative', padding: 4 },
  cartNavIcon: { fontSize: 22 },
  cartNavBadge: {
    position: 'absolute', top: 0, right: 0, backgroundColor: '#D32F2F',
    borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center',
    alignItems: 'center', paddingHorizontal: 2,
  },
  cartNavBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  coverSection: {
    backgroundColor: '#FFFFFF', alignItems: 'center', paddingVertical: 32,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  bookCover: {
    width: SCREEN_WIDTH * 0.5, height: SCREEN_WIDTH * 0.68, borderRadius: 10,
    padding: 14, justifyContent: 'flex-end',
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 10,
  },
  discountBadge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: '#D32F2F',
    borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4,
  },
  discountText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  coverCategory: { color: 'rgba(255,255,255,0.65)', fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
  coverTitle: {
    color: '#FFFFFF', fontSize: 16, fontWeight: '900', lineHeight: 21, marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },
  coverAuthor: { color: 'rgba(255,255,255,0.88)', fontSize: 11, fontWeight: '600' },

  infoCard: {
    backgroundColor: '#FFFFFF', margin: 12, borderRadius: 12, padding: 18,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4,
  },
  categoryTag: { fontSize: 12, color: '#777', marginBottom: 5 },
  bookTitle: { fontSize: 20, fontWeight: '800', color: '#111', lineHeight: 26, marginBottom: 10 },
  currentPrice: { fontSize: 30, fontWeight: '900', color: '#1B6B2F', marginBottom: 6 },
  priceMetaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  saveText: { fontSize: 13, color: '#1B6B2F', fontWeight: '600' },
  stockText: { fontSize: 13, color: '#1B6B2F', fontWeight: '700', marginLeft: 'auto' },

  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 4 },
  star: { fontSize: 18 },
  ratingNumber: { fontSize: 14, fontWeight: '700', color: '#111', marginLeft: 4 },
  reviewCount: { fontSize: 12, color: '#888', marginLeft: 2 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },

  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  quantityLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  qtyControls: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
    borderColor: '#DDD', borderRadius: 8, overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F5F5F5' },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#333' },
  qtyValue: { paddingHorizontal: 18, fontSize: 16, fontWeight: '700', color: '#111' },

  addToCartBtn: { backgroundColor: '#F57C00', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  addedBtn: { backgroundColor: '#1B6B2F' },
  addToCartText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  buyNowBtn: { borderRadius: 10, paddingVertical: 13, alignItems: 'center', borderWidth: 2, borderColor: '#1B6B2F' },
  buyNowText: { color: '#1B6B2F', fontSize: 15, fontWeight: '800' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 12 },
  featuresTable: { borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 8, overflow: 'hidden' },
  featureRow: {
    flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#FAFAFA',
  },
  featureRowLast: { borderBottomWidth: 0 },
  featureLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: '#333' },
  featureValue: { flex: 1.2, fontSize: 13, color: '#555', textAlign: 'right' },
  descriptionText: { fontSize: 14, color: '#444', lineHeight: 22 },

  deliveryBox: {
    backgroundColor: '#F0FAF3', borderRadius: 10, padding: 14, gap: 12,
    marginTop: 16, borderWidth: 1, borderColor: '#C8E6C9',
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  deliveryIcon: { fontSize: 20, marginTop: 1 },
  deliveryTitle: { fontSize: 13, fontWeight: '700', color: '#1B6B2F' },
  deliverySub: { fontSize: 11, color: '#555', marginTop: 1 },

  // ── Reviews section ──
  reviewsSection: {
    backgroundColor: '#FFFFFF', marginHorizontal: 12, marginTop: 4,
    borderRadius: 12, padding: 18,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 4,
  },
  reviewsTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  reviewsTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  writeReviewBtn: {
    backgroundColor: '#1B6B2F', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  writeReviewBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  ratingSummary: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  ratingSummaryLeft: { alignItems: 'center', justifyContent: 'center', width: 80 },
  bigRating: { fontSize: 42, fontWeight: '900', color: '#111', lineHeight: 48 },
  bigStarRow: { flexDirection: 'row', gap: 2, marginBottom: 4 },
  bigStar: { fontSize: 14 },
  totalReviews: { fontSize: 11, color: '#888', textAlign: 'center' },
  ratingSummaryRight: { flex: 1, justifyContent: 'center', gap: 4 },

  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingBarLabel: { fontSize: 12, color: '#888', width: 18, textAlign: 'right' },
  ratingBarTrack: {
    flex: 1, height: 7, backgroundColor: '#F0F0F0',
    borderRadius: 4, overflow: 'hidden',
  },
  ratingBarFill: { height: '100%', backgroundColor: '#FFB800', borderRadius: 4 },
  ratingBarCount: { fontSize: 11, color: '#888', width: 22, textAlign: 'right' },

  noReviews: { alignItems: 'center', paddingVertical: 28 },
  noReviewsIcon: { fontSize: 40, marginBottom: 10 },
  noReviewsText: { fontSize: 14, color: '#888' },

  reviewCard: {
    borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 10,
    padding: 14, marginBottom: 12, backgroundColor: '#FAFAFA',
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#1B6B2F',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  reviewMeta: { flex: 1 },
  reviewerName: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 2 },
  reviewStarRow: { flexDirection: 'row', gap: 1 },
  reviewStar: { fontSize: 13 },
  reviewDate: { fontSize: 11, color: '#AAA' },
  reviewText: { fontSize: 13, color: '#444', lineHeight: 20 },

  // ── Write review modal ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 20, paddingBottom: 34,
  },
  modalHandle: { width: 38, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginVertical: 12 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 4 },
  modalBookTitle: { fontSize: 13, color: '#888', marginBottom: 16 },
  modalLabel: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  interactiveStarRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  interactiveStar: { fontSize: 32 },
  interactiveStarLabel: { fontSize: 14, color: '#888', fontWeight: '500', marginLeft: 4 },
  reviewInput: {
    borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10,
    padding: 12, fontSize: 14, color: '#111', minHeight: 120,
    backgroundColor: '#FAFAFA', marginBottom: 4,
  },
  charCount: { fontSize: 11, color: '#AAA', textAlign: 'right', marginBottom: 16 },
  modalBtnRow: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: {
    flex: 1, borderRadius: 10, paddingVertical: 13, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#DDD',
  },
  modalCancelText: { fontSize: 14, color: '#555', fontWeight: '700' },
  modalSubmitBtn: {
    flex: 2, backgroundColor: '#1B6B2F', borderRadius: 10, paddingVertical: 13, alignItems: 'center',
  },
  modalSubmitText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
});

export default BookDetailScreen;
