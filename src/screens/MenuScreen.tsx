import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import MenuItemCard from '../components/MenuItemCard';

const MOCK_MENU = [
  { id: '1', name: 'Veg Thali', category: 'Lunch', price: 60 },
  { id: '2', name: 'Egg Curry', category: 'Lunch', price: 40 },
  { id: '3', name: 'Chicken Biryani', category: 'Dinner', price: 120 },
  { id: '4', name: 'Masala Dosa', category: 'Breakfast', price: 45 },
  { id: '5', name: 'Paneer Butter Masala', category: 'Dinner', price: 80 },
];

export default function MenuScreen({ navigation }: any) {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_MENU}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onAdd={handleAddToCart} />
        )}
        ListHeaderComponent={() => (
          <Text style={styles.headerTitle}>Full Menu</Text>
        )}
      />

      {cartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('CartScreen')}
          >
            <View>
              <Text style={styles.cartText}>View Cart</Text>
              <Text style={styles.cartSubText}>{cartCount} items added</Text>
            </View>
            <Text style={styles.cartArrow}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // accommodate floating button
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d3748',
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  cartButton: {
    backgroundColor: '#2b6cb0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartSubText: {
    color: '#ebf8ff',
    fontSize: 12,
    marginTop: 2,
  },
  cartArrow: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
