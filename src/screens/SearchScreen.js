import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { newReleases, bestSellers, categories } from '../data/books';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2.3;

const ALL_BOOKS = [
  ...newReleases,
  ...bestSellers.map((b) => ({ ...b, badge: 'Best Seller' })),
];

const SORT_OPTIONS = ['Relevance', 'Price: Low–High', 'Price: High–Low', 'Highest Rated', 'Most Reviews'];
const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under £5', min: 0, max: 5 },
  { label: '£5 – £10', min: 5, max: 10 },
  { label: '£10 – £15', min: 10, max: 15 },
  { label: 'Over £15', min: 15, max: Infinity },
];
const RATING_OPTIONS = [
  { label: 'Any rating', min: 0 },
  { label: '4.5+ ★★★★★', min: 4.5 },
  { label: '4.0+ ★★★★', min: 4.0 },
  { label: '3.5+ ★★★', min: 3.5 },
];
const BADGE_OPTIONS = ['All', 'Sale', 'Best Seller'];

// ─── Book card ────────────────────────────────────────────────────────────────
const SearchBookCard = ({ book, onPress, onAddToCart }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 1.05, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  return (
    <Animated.View style={[{ width: CARD_WIDTH }, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => onPress(book)}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.95}
      >
        <View style={[styles.coverBox, { backgroundColor: book.color }]}>
          {book.badge && (
            <View style={[styles.badge, { backgroundColor: book.badge === 'Best Seller' ? '#F57C00' : '#D32F2F' }]}>
              <Text style={styles.badgeText}>{book.badge}</Text>
            </View>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
          <Text style={styles.coverTitle} numberOfLines={4}>{book.title}</Text>
          <Text style={styles.coverAuthor} numberOfLines={1}>{book.author}</Text>
          {book.rating && (
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStars}>{'★'.repeat(Math.floor(book.rating))}</Text>
              <Text style={styles.ratingVal}>{book.rating}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.cardAuthor} numberOfLines={1}>{book.author}</Text>
          {book.category && (
            <Text style={styles.cardCategory}>{book.category}</Text>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{book.price.toFixed(2)}</Text>
            {book.originalPrice && (
              <Text style={styles.originalPrice}>£{book.originalPrice.toFixed(2)}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => onAddToCart(book)}>
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Filter Panel (Modal bottom-sheet) ───────────────────────────────────────
const FilterPanel = ({
  visible,
  onClose,
  onApply,
  priceRange, setPriceRange,
  ratingFilter, setRatingFilter,
  badgeFilter, setBadgeFilter,
  sortBy, setSortBy,
  onReset,
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const SectionTitle = ({ title }) => (
    <Text style={filterStyles.sectionTitle}>{title}</Text>
  );

  const OptionChip = ({ label, active, onPress }) => (
    <TouchableOpacity
      style={[filterStyles.chip, active && filterStyles.chipActive]}
      onPress={onPress}
    >
      <Text style={[filterStyles.chipText, active && filterStyles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={filterStyles.overlay}>
        <TouchableOpacity style={filterStyles.overlayBg} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[filterStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={filterStyles.handle} />

          <View style={filterStyles.headerRow}>
            <Text style={filterStyles.title}>Filter & Sort</Text>
            <TouchableOpacity onPress={onReset}>
              <Text style={filterStyles.resetText}>Reset all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Sort By */}
            <SectionTitle title="Sort by" />
            <View style={filterStyles.chipRow}>
              {SORT_OPTIONS.map((opt) => (
                <OptionChip
                  key={opt}
                  label={opt}
                  active={sortBy === opt}
                  onPress={() => setSortBy(opt)}
                />
              ))}
            </View>

            <View style={filterStyles.divider} />

            {/* Price Range */}
            <SectionTitle title="Price range" />
            <View style={filterStyles.chipRow}>
              {PRICE_RANGES.map((r) => (
                <OptionChip
                  key={r.label}
                  label={r.label}
                  active={priceRange.label === r.label}
                  onPress={() => setPriceRange(r)}
                />
              ))}
            </View>

            <View style={filterStyles.divider} />

            {/* Rating */}
            <SectionTitle title="Minimum rating" />
            <View style={filterStyles.chipRow}>
              {RATING_OPTIONS.map((r) => (
                <OptionChip
                  key={r.label}
                  label={r.label}
                  active={ratingFilter.label === r.label}
                  onPress={() => setRatingFilter(r)}
                />
              ))}
            </View>

            <View style={filterStyles.divider} />

            {/* Badge / Type */}
            <SectionTitle title="Book type" />
            <View style={filterStyles.chipRow}>
              {BADGE_OPTIONS.map((b) => (
                <OptionChip
                  key={b}
                  label={b}
                  active={badgeFilter === b}
                  onPress={() => setBadgeFilter(b)}
                />
              ))}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity style={filterStyles.applyBtn} onPress={onApply}>
            <Text style={filterStyles.applyBtnText}>Show Results</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── Main Search Screen ───────────────────────────────────────────────────────
const SearchScreen = ({
  cartCount, onBack, onGoCart, onBookDetail, onAddToCart,
  initialCategory, initialBadge, initialSort,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || null);
  const [sortBy, setSortBy] = useState(initialSort || 'Relevance');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState(['Atomic Habits', 'Harlan Coben', 'Self-Help']);
  const [filterVisible, setFilterVisible] = useState(false);

  // Filter state — seed from initial props
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [ratingFilter, setRatingFilter] = useState(RATING_OPTIONS[0]);
  const [badgeFilter, setBadgeFilter] = useState(initialBadge || 'All');

  // Pending filter state (shown inside panel, committed on "Show Results")
  const [pendingPrice, setPendingPrice] = useState(PRICE_RANGES[0]);
  const [pendingRating, setPendingRating] = useState(RATING_OPTIONS[0]);
  const [pendingBadge, setPendingBadge] = useState(initialBadge || 'All');
  const [pendingSort, setPendingSort] = useState(initialSort || 'Relevance');

  const inputRef = useRef(null);

  // Only auto-focus if no initial params (so keyboard doesn't pop up when filtering by category)
  useEffect(() => {
    if (!initialCategory && !initialBadge && !initialSort) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, []);

  const activeFilterCount = [
    priceRange.label !== 'Any price' ? 1 : 0,
    ratingFilter.min > 0 ? 1 : 0,
    badgeFilter !== 'All' ? 1 : 0,
    sortBy !== 'Relevance' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const runSearch = useCallback((q, cat, sort, price, rating, badge) => {
    let filtered = ALL_BOOKS;

    if (q.trim()) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.category?.toLowerCase().includes(lower)
      );
    }
    if (cat) {
      filtered = filtered.filter((b) => b.category?.toLowerCase() === cat.toLowerCase());
    }
    // Price
    filtered = filtered.filter((b) => b.price >= price.min && b.price < price.max);
    // Rating
    if (rating.min > 0) {
      filtered = filtered.filter((b) => (b.rating || 0) >= rating.min);
    }
    // Badge
    if (badge !== 'All') {
      filtered = filtered.filter((b) => b.badge === badge);
    }
    // Sort
    if (sort === 'Price: Low–High') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High–Low') filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sort === 'Highest Rated') filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'Most Reviews') filtered = [...filtered].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));

    setResults(filtered);
  }, []);

  useEffect(() => {
    runSearch(query, activeCategory, sortBy, priceRange, ratingFilter, badgeFilter);
  }, [query, activeCategory, sortBy, priceRange, ratingFilter, badgeFilter, runSearch]);

  const handleSubmit = () => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 6));
    }
  };

  const openFilter = () => {
    setPendingPrice(priceRange);
    setPendingRating(ratingFilter);
    setPendingBadge(badgeFilter);
    setPendingSort(sortBy);
    setFilterVisible(true);
  };

  const applyFilters = () => {
    setPriceRange(pendingPrice);
    setRatingFilter(pendingRating);
    setBadgeFilter(pendingBadge);
    setSortBy(pendingSort);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setPendingPrice(PRICE_RANGES[0]);
    setPendingRating(RATING_OPTIONS[0]);
    setPendingBadge('All');
    setPendingSort('Relevance');
  };

  const clearAllFilters = () => {
    setPriceRange(PRICE_RANGES[0]);
    setRatingFilter(RATING_OPTIONS[0]);
    setBadgeFilter('All');
    setSortBy('Relevance');
    setActiveCategory(null);
    setQuery('');
  };

  // Show results if there's a text query, active category, or any non-default filter/sort
  const hasQuery =
    query.trim().length > 0 ||
    activeCategory != null ||
    badgeFilter !== 'All' ||
    sortBy !== 'Relevance' ||
    priceRange.label !== 'Any price' ||
    ratingFilter.min > 0;

  return (
    <View style={styles.container}>
      {/* ── Search Header ── */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Text style={styles.searchBarIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search books, authors, genres..."
            placeholderTextColor="#AAA"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.cartNavBtn} onPress={onGoCart}>
          <Text style={styles.cartNavIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Category chips + Filter button ── */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory((p) => (p === cat ? null : cat))}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]} onPress={openFilter}>
          <Text style={[styles.filterBtnIcon, activeFilterCount > 0 && styles.filterBtnIconActive]}>⚙</Text>
          <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Active filter pills ── */}
      {activeFilterCount > 0 && (
        <View style={styles.activePillsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activePillsContent}>
            {sortBy !== 'Relevance' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>⇅ {sortBy}</Text>
                <TouchableOpacity onPress={() => setSortBy('Relevance')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text style={styles.pillClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {priceRange.label !== 'Any price' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>💰 {priceRange.label}</Text>
                <TouchableOpacity onPress={() => setPriceRange(PRICE_RANGES[0])} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text style={styles.pillClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {ratingFilter.min > 0 && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>★ {ratingFilter.min}+</Text>
                <TouchableOpacity onPress={() => setRatingFilter(RATING_OPTIONS[0])} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text style={styles.pillClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {badgeFilter !== 'All' && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>🏷 {badgeFilter}</Text>
                <TouchableOpacity onPress={() => setBadgeFilter('All')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Text style={styles.pillClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.clearAllPill} onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* ── Content ── */}
      {!hasQuery ? (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {recentSearches.length > 0 && (
            <View style={styles.suggestSection}>
              <View style={styles.suggestHeader}>
                <Text style={styles.suggestTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={styles.clearAllLink}>Clear all</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.recentItem}
                  onPress={() => setQuery(term)}
                >
                  <Text style={styles.recentIcon}>🕐</Text>
                  <Text style={styles.recentText}>{term}</Text>
                  <Text style={styles.recentArrow}>↗</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.suggestSection}>
            <Text style={styles.suggestTitle}>Popular Categories</Text>
            <View style={styles.categoryGrid}>
              {categories.slice(0, 8).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryGridItem}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={styles.categoryGridText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.suggestSection}>
            <Text style={styles.suggestTitle}>Trending Books</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
              {ALL_BOOKS.slice(0, 6).map((book) => (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.trendingCard, { backgroundColor: book.color }]}
                  onPress={() => onBookDetail(book)}
                >
                  <Text style={styles.trendingTitle} numberOfLines={3}>{book.title}</Text>
                  <Text style={styles.trendingAuthor} numberOfLines={1}>{book.author}</Text>
                  <Text style={styles.trendingPrice}>£{book.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          {/* Results count row */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              <Text style={styles.resultsCountBold}>{results.length}</Text>
              {' '}result{results.length !== 1 ? 's' : ''}
              {query.trim() ? ` for "${query.trim()}"` : ''}
              {activeCategory ? ` in ${activeCategory}` : ''}
            </Text>
          </View>

          {results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsIcon}>📭</Text>
              <Text style={styles.noResultsTitle}>No books found</Text>
              <Text style={styles.noResultsSub}>Try adjusting your filters or search term</Text>
              <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearAllFilters}>
                <Text style={styles.clearFiltersBtnText}>Clear all filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.resultsGrid}
              columnWrapperStyle={styles.columnWrapper}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <SearchBookCard
                  book={item}
                  onPress={onBookDetail}
                  onAddToCart={onAddToCart}
                />
              )}
            />
          )}
        </View>
      )}

      {/* Filter Panel */}
      <FilterPanel
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={applyFilters}
        priceRange={pendingPrice} setPriceRange={setPendingPrice}
        ratingFilter={pendingRating} setRatingFilter={setPendingRating}
        badgeFilter={pendingBadge} setBadgeFilter={setPendingBadge}
        sortBy={pendingSort} setSortBy={setPendingSort}
        onReset={resetFilters}
      />
    </View>
  );
};

// ─── Filter Panel styles ──────────────────────────────────────────────────────
const filterStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingBottom: 30,
    maxHeight: '78%',
  },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#111' },
  resetText: { fontSize: 13, color: '#D32F2F', fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#333', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
  },
  chipActive: { backgroundColor: '#1B6B2F', borderColor: '#1B6B2F' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive: { color: '#FFF', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  applyBtn: {
    backgroundColor: '#1B6B2F',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: '#1B6B2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  applyBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B6B2F',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 30, color: '#FFFFFF', fontWeight: '300', lineHeight: 34 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchBarIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: '#111', paddingVertical: 0 },
  clearBtn: { padding: 4 },
  clearBtnText: { fontSize: 14, color: '#AAA', fontWeight: '700' },
  cartNavBtn: { position: 'relative', padding: 6 },
  cartNavIcon: { fontSize: 22 },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  cartBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },

  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingRight: 10,
  },
  chipsContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipActive: { backgroundColor: '#1B6B2F', borderColor: '#1B6B2F' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '700' },

  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexShrink: 0,
  },
  filterBtnActive: { backgroundColor: '#1B6B2F', borderColor: '#1B6B2F' },
  filterBtnIcon: { fontSize: 14, color: '#555' },
  filterBtnIconActive: { color: '#FFF' },
  filterBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
  filterBtnTextActive: { color: '#FFF', fontWeight: '700' },

  activePillsRow: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  activePillsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 6, flexDirection: 'row' },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  activePillText: { fontSize: 12, color: '#1B6B2F', fontWeight: '600' },
  pillClose: { fontSize: 11, color: '#1B6B2F', fontWeight: '800' },
  clearAllPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  clearAllText: { fontSize: 12, color: '#F57C00', fontWeight: '700' },

  scroll: { flex: 1 },

  suggestSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  suggestHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  suggestTitle: { fontSize: 15, fontWeight: '800', color: '#111' },
  clearAllLink: { fontSize: 12, color: '#1B6B2F', fontWeight: '600' },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  recentIcon: { fontSize: 16 },
  recentText: { flex: 1, fontSize: 14, color: '#333' },
  recentArrow: { fontSize: 14, color: '#CCC' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  categoryGridItem: {
    backgroundColor: '#F0FAF3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  categoryGridText: { fontSize: 13, color: '#1B6B2F', fontWeight: '600' },
  trendingCard: {
    width: 110,
    height: 148,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'flex-end',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  trendingTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 14,
    marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  trendingAuthor: { color: 'rgba(255,255,255,0.8)', fontSize: 8 },
  trendingPrice: { color: '#FFF', fontSize: 11, fontWeight: '800', marginTop: 3 },

  resultsContainer: { flex: 1 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  resultsCount: { fontSize: 13, color: '#666' },
  resultsCountBold: { fontWeight: '800', color: '#111' },

  noResults: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  noResultsIcon: { fontSize: 52, marginBottom: 14 },
  noResultsTitle: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 8 },
  noResultsSub: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  clearFiltersBtn: {
    backgroundColor: '#1B6B2F',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  clearFiltersBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  resultsGrid: { padding: 12, gap: 12 },
  columnWrapper: { gap: 12 },

  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  coverBox: {
    height: 148,
    padding: 8,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 7,
    left: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  discountBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  coverTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  coverAuthor: { color: 'rgba(255,255,255,0.85)', fontSize: 8.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 3 },
  ratingStars: { color: '#FFD600', fontSize: 9 },
  ratingVal: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  cardInfo: { padding: 9 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#111', lineHeight: 16, marginBottom: 1 },
  cardAuthor: { fontSize: 10, color: '#777', marginBottom: 2 },
  cardCategory: {
    fontSize: 9,
    color: '#1B6B2F',
    fontWeight: '600',
    backgroundColor: '#F0FAF3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 7 },
  price: { fontSize: 13, fontWeight: '800', color: '#1B6B2F' },
  originalPrice: { fontSize: 10, color: '#AAA', textDecorationLine: 'line-through' },
  addBtn: { backgroundColor: '#F57C00', borderRadius: 6, paddingVertical: 6, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});

export default SearchScreen;
