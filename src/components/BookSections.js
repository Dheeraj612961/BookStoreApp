import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { newReleases, bestSellers } from '../data/books';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2.4;

const BookCard = ({ book, onPress, onDetailPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.06,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[styles.bookCardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => onDetailPress && onDetailPress(book)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        {/* Book Cover */}
        <View style={[styles.bookCoverContainer, { backgroundColor: book.color }]}>
          {book.badge && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{book.badge}</Text>
            </View>
          )}
          <Text style={styles.bookCoverTitle} numberOfLines={4}>
            {book.title}
          </Text>
          <Text style={styles.bookCoverAuthor} numberOfLines={2}>
            {book.author}
          </Text>
          {book.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>{'★'.repeat(Math.floor(book.rating))}</Text>
              <Text style={styles.ratingText}>{book.rating}</Text>
            </View>
          )}
        </View>
        {/* Book Info */}
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.author}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.bookPrice}>£{book.price.toFixed(2)}</Text>
            {book.originalPrice && (
              <Text style={styles.bookOriginalPrice}>£{book.originalPrice.toFixed(2)}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => onPress && onPress(book)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BookSection = ({ title, data, onBookPress, onDetailPress, onSeeAllPress }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAllPress}>
        <Text style={styles.seeAllText}>See All →</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.bookListContent}
      renderItem={({ item }) => (
        <View style={{ width: CARD_WIDTH, marginRight: 10 }}>
          <BookCard book={item} onPress={onBookPress} onDetailPress={onDetailPress} />
        </View>
      )}
    />
  </View>
);

const BookSections = ({ onBookPress, onDetailPress, onSeeAllPress }) => (
  <View>
    <BookSection
      title="New Releases"
      data={newReleases}
      onBookPress={onBookPress}
      onDetailPress={onDetailPress}
      onSeeAllPress={() => onSeeAllPress && onSeeAllPress('New Releases')}
    />
    <BookSection
      title="Best Sellers"
      data={bestSellers}
      onBookPress={onBookPress}
      onDetailPress={onDetailPress}
      onSeeAllPress={() => onSeeAllPress && onSeeAllPress('Best Sellers')}
    />
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  seeAllText: {
    fontSize: 13,
    color: '#1B6B2F',
    fontWeight: '600',
  },
  bookListContent: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  bookCardWrapper: {
    flex: 1,
  },
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    flex: 1,
  },
  bookCoverContainer: {
    height: 140,
    padding: 8,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bookCoverTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bookCoverAuthor: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  ratingStars: {
    color: '#FFD600',
    fontSize: 10,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  bookInfo: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 16,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 10,
    color: '#666',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B6B2F',
  },
  bookOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartBtn: {
    backgroundColor: '#F57C00',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default BookSections;
