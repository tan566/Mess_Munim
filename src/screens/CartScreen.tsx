import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import CartItem from '../components/CartItem';

const MOCK_CART = [
  { id: '1', name: 'Veg Thali', price: 60, quantity: 1 },
  { id: '2', name: 'Paneer Butter Masala', price: 80, quantity: 1 },
];

export default function CartScreen({ navigation }: any) {
  const [items, setItems] = useState(MOCK_CART);

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // In real app, call backend to create transaction, deduct balance, generate token
    navigation.navigate('QRScreen', { totalAmount });
  };

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>Go back to Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CartItem item={item} onRemove={() => handleRemove(item.id)} />
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹ {totalAmount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Pay & Generate QR</Text>
            </TouchableOpacity>
          </View>
        </>
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
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#a0aec0',
    marginBottom: 20,
  },
  backBtn: {
    padding: 10,
    backgroundColor: '#ebf8ff',
    borderRadius: 8,
  },
  backText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: '#4a5568',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  checkoutBtn: {
    backgroundColor: '#38a169',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
