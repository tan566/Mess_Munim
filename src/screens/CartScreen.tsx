import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCart, updateCartQty, mockCheckout, mockGetStudent } from '../data/mockData';

export default function CartScreen({ route, navigation }: any) {
  const userId = route.params?.userId || 1;
  const [items, setItems] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setItems([...getCart(userId)]);
      const user = mockGetStudent(userId);
      if (user) setBalance(user.balance);
    }, [userId])
  );

  const refresh = () => {
    setItems([...getCart(userId)]);
    const user = mockGetStudent(userId);
    if (user) setBalance(user.balance);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleQtyChange = (mealId: number, delta: number) => {
    updateCartQty(userId, mealId, delta);
    refresh();
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (balance < total) {
      Alert.alert('Insufficient Balance', `Your wallet has ₹${balance} but total is ₹${total}.`);
      return;
    }
    const description = items.map(i => `${i.name} x${i.quantity}`).join(', ');
    const result = mockCheckout(userId, total, description);
    if ('error' in result) {
      Alert.alert('Checkout Failed', result.error);
    } else {
      navigation.replace('QRScreen', { qrPayload: result.qrPayload, total, userId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back to Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.balanceText}>Wallet Balance: ₹{balance.toFixed(2)}</Text>
          <FlatList
            data={items}
            keyExtractor={item => item.mealId.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price} each</Text>
                </View>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.mealId, -1)}>
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQtyChange(item.mealId, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.subtotal}>₹{(item.price * item.quantity).toFixed(0)}</Text>
                </View>
              </View>
            )}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={[styles.totalValue, total > balance && styles.overBalance]}>₹{total.toFixed(2)}</Text>
            </View>
            {total > balance && (
              <Text style={styles.warningText}>⚠️ Insufficient balance</Text>
            )}
            <TouchableOpacity
              style={[styles.checkoutBtn, total > balance && styles.checkoutDisabled]}
              onPress={handleCheckout}
              disabled={total > balance}
            >
              <Text style={styles.checkoutText}>Pay & Generate QR</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#a0aec0', marginBottom: 20 },
  backBtn: { padding: 12, backgroundColor: '#ebf8ff', borderRadius: 8 },
  backText: { color: '#2b6cb0', fontWeight: 'bold' },
  balanceText: { textAlign: 'right', paddingHorizontal: 20, paddingTop: 12, color: '#38a169', fontWeight: 'bold', fontSize: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2,
  },
  info: { marginBottom: 10 },
  name: { fontSize: 17, fontWeight: 'bold', color: '#2d3748' },
  price: { fontSize: 13, color: '#718096', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { backgroundColor: '#edf2f7', width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 20, fontWeight: 'bold', color: '#2b6cb0' },
  qty: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, color: '#2d3748' },
  subtotal: { marginLeft: 'auto', fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
  footer: { backgroundColor: '#fff', padding: 24, borderTopWidth: 1, borderColor: '#e2e8f0' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 18, color: '#4a5568' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#2d3748' },
  overBalance: { color: '#e53e3e' },
  warningText: { color: '#e53e3e', fontSize: 13, marginBottom: 8 },
  checkoutBtn: { backgroundColor: '#38a169', padding: 16, borderRadius: 12, alignItems: 'center' },
  checkoutDisabled: { backgroundColor: '#a0aec0' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
