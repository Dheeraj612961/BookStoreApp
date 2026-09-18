import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InfoBanner = () => {
  const infos = [
    { icon: '🚚', text: 'Free shipping orders over £10' },
    { icon: '🛡️', text: '30 days money back guarantee' },
    { icon: '📦', text: 'Free Delivery available to UK' },
    { icon: '🕐', text: 'Shipping from Warehouses: UK, US' },
  ];

  return (
    <View style={styles.bannerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {infos.map((info, index) => (
          <React.Fragment key={index}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{info.icon}</Text>
              <Text style={styles.infoText}>{info.text}</Text>
            </View>
            {index < infos.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: '#CCCCCC',
  },
});

export default InfoBanner;
