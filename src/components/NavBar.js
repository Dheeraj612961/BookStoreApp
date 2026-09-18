import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { categories } from '../data/books';

const NavBar = ({ onCategoryPress, onWhatsNew, onBestSellers, onCoupons, onTodaysDeals }) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  return (
    <>
      <View style={styles.navContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navScrollContent}
        >
          {/* Shop by category */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={styles.navIcon}>🔥</Text>
            <Text style={styles.navText}>Shop by category</Text>
            <Text style={styles.navArrow}>▾</Text>
          </TouchableOpacity>

          <View style={styles.navDivider} />

          <TouchableOpacity style={styles.navItem} onPress={onWhatsNew}>
            <Text style={styles.navIcon}>⭐</Text>
            <Text style={styles.navText}>What's New</Text>
          </TouchableOpacity>

          <View style={styles.navDivider} />

          <TouchableOpacity style={styles.navItem} onPress={onBestSellers}>
            <Text style={styles.navIcon}>👑</Text>
            <Text style={styles.navText}>Best Sellers</Text>
          </TouchableOpacity>

          <View style={styles.navDivider} />

          <TouchableOpacity style={styles.navItem} onPress={onCoupons}>
            <Text style={styles.navIcon}>🏷️</Text>
            <Text style={styles.navText}>Coupons Deals</Text>
          </TouchableOpacity>

          <View style={styles.navSpacer} />

          <TouchableOpacity style={styles.dealButton} onPress={onTodaysDeals}>
            <Text style={styles.dealText}>Shop Today's Deals</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Category Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setCategoryModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.categoryDropdown}>
            <Text style={styles.categoryDropdownTitle}>📚 Browse Categories</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategoryModalVisible(false);
                    onCategoryPress && onCategoryPress(item);
                  }}
                >
                  <Text style={styles.categoryItemText}>{item}</Text>
                  <Text style={styles.categoryArrow}>›</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#1B6B2F',
    borderTopWidth: 1,
    borderTopColor: '#145A27',
  },
  navScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  navIcon: { fontSize: 14 },
  navText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
  navArrow: { color: '#FFFFFF', fontSize: 11 },
  navDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
  },
  navSpacer: { flex: 1, minWidth: 20 },
  dealButton: { paddingHorizontal: 10, paddingVertical: 6 },
  dealText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 110,
    paddingLeft: 12,
  },
  categoryDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    width: 220,
    maxHeight: 360,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  categoryDropdownTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1B6B2F',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    marginBottom: 4,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  categoryItemText: { flex: 1, fontSize: 14, color: '#222', fontWeight: '500' },
  categoryArrow: { fontSize: 16, color: '#BBBBBB' },
});

export default NavBar;
