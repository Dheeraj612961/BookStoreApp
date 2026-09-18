import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { heroBooks } from '../data/books';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HeroBookCard = ({ book }) => (
  <View style={[styles.heroBookCard, { backgroundColor: book.color }]}>
    <Text
      style={[styles.heroBookTitle, { color: book.textColor }]}
      numberOfLines={4}
    >
      {book.title}
    </Text>
    <Text style={[styles.heroBookAuthor, { color: book.textColor }]}>
      {book.author}
    </Text>
  </View>
);

const HeroBanner = ({ onShopNowPress }) => {
  const [currentDot, setCurrentDot] = useState(0);
  const scrollRef = useRef(null);

  const slides = [
    { id: 'slide1' },
    { id: 'slide2' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDot((prev) => {
        const next = (prev + 1) % slides.length;
        scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.heroBannerWrapper}>
      <View style={styles.heroBannerContainer}>
        {/* Left side: Text content */}
        <View style={styles.heroLeft}>
          <Text style={styles.heroTopText}>TOP READS TO HELP YOU</Text>
          <View style={styles.heroTagsContainer}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>MAKE</Text>
            </View>
            <View style={styles.heroTagWide}>
              <Text style={styles.heroTagText}>MANAGE</Text>
            </View>
            <View style={styles.heroTagWidest}>
              <Text style={styles.heroTagText}>MULTIPLY</Text>
            </View>
          </View>
          <View style={styles.lightBulbRow}>
            <Text style={styles.lightBulbEmoji}>💡</Text>
            <Text style={styles.heroBottomText}>YOUR MONEY</Text>
          </View>
          <TouchableOpacity style={styles.shopNowButton} onPress={onShopNowPress}>
            <Text style={styles.shopNowText}>Shop Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Right side: Book covers */}
        <View style={styles.heroRight}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.heroBookScroll}
          >
            {heroBooks.map((book) => (
              <HeroBookCard key={book.id} book={book} />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Dot indicators */}
      <View style={styles.dotContainer}>
        {slides.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.dot, i === currentDot ? styles.dotActive : null]}
            onPress={() => {
              setCurrentDot(i);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroBannerWrapper: {
    backgroundColor: '#22C55E',
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  heroBannerContainer: {
    flexDirection: 'row',
    minHeight: 220,
    paddingTop: 16,
    paddingBottom: 10,
    paddingLeft: 14,
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  heroTopText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroTagsContainer: {
    gap: 6,
    marginBottom: 6,
  },
  heroTag: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 4,
  },
  heroTagWide: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 4,
  },
  heroTagWidest: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 5,
    borderRadius: 4,
  },
  heroTagText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  lightBulbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  lightBulbEmoji: {
    fontSize: 22,
  },
  heroBottomText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shopNowButton: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  shopNowText: {
    color: '#1B6B2F',
    fontSize: 12,
    fontWeight: '700',
  },
  heroRight: {
    width: SCREEN_WIDTH * 0.48,
    justifyContent: 'center',
  },
  heroBookScroll: {
    gap: 6,
    paddingRight: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  heroBookCard: {
    width: 76,
    height: 110,
    borderRadius: 6,
    padding: 6,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  heroBookTitle: {
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 13,
  },
  heroBookAuthor: {
    fontSize: 8,
    fontWeight: '500',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
    borderRadius: 4,
  },
});

export default HeroBanner;
