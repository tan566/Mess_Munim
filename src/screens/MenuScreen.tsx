import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

// In-memory cart (per session)
const cart: Record<string, { meal: any; quantity: number }> = {};

export function getCart() { return Object.values(cart); }
export function addToCart(meal: any) {
  if (cart[meal.id]) cart[meal.id].quantity += 1;
  else cart[meal.id] = { meal, quantity: 1 };
}
export function updateCartQty(mealId: number, delta: number) {
  if (!cart[mealId]) return;
  cart[mealId].quantity += delta;
  if (cart[mealId].quantity <= 0) delete cart[mealId];
}
export function clearCart() { Object.keys(cart).forEach(k => delete cart[k]); }
export function cartTotal() { return getCart().reduce((s, i) => s + i.meal.price * i.quantity, 0); }

export default function MenuScreen({ route, navigation }: any) {
  const [mealList, setMealList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const userId = route.params?.userId;

  useEffect(() => {
    supabase.from('daily_meals').select('*').eq('is_available', true).then(({ data }) => {
      setMealList(data ?? []);
      setLoading(false);
    });
  }, []);

  const refreshCount = () => setCartCount(getCart().reduce((s, i) => s + i.quantity, 0));

  const handleAdd = (meal: any) => {
    addToCart(meal);
    refreshCount();
    Alert.alert('Added!', `${meal.meal_time} added to cart.`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.mealTimeText}>{item.meal_time}</Text>
        <Text style={styles.priceBadge}>₹ {item.price}</Text>
      </View>
      <Text style={styles.descText}>{item.description}</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(item)}>
        <Text style={styles.addBtnText}>+ Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Today's Menu</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('CartScreen', { userId })}>
          <Text style={styles.cartBtnText}>🛒 Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2b6cb0" /></View>
      ) : (
        <FlatList data={mealList} keyExtractor={i => i.id.toString()} renderItem={renderItem} contentContainerStyle={{ paddingBottom: 20 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#2d3748' },
  cartBtn: { backgroundColor: '#2b6cb0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  cartBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#3182ce', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealTimeText: { fontSize: 20, fontWeight: 'bold', color: '#2b6cb0' },
  priceBadge: { backgroundColor: '#c6f6d5', color: '#22543d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: 'bold', fontSize: 16 },
  descText: { fontSize: 15, color: '#4a5568', marginBottom: 16, lineHeight: 22 },
  addBtn: { backgroundColor: '#2b6cb0', padding: 12, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
