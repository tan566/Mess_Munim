import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { meals, addToCart, getCart } from '../data/mockData';

export default function MenuScreen({ route, navigation }: any) {
  const [mealList, setMealList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const userId = route.params?.userId || 1;

  useEffect(() => {
    setMealList(meals.filter(m => m.is_available));
    setLoading(false);
  }, []);

  const refreshCartCount = () => {
    const cart = getCart(userId);
    setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
  };

  useEffect(() => { refreshCartCount(); }, []);

  const handleAddToCart = (meal: any) => {
    addToCart(userId, meal);
    refreshCartCount();
    Alert.alert('Added!', `${meal.meal_time} added to cart.`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.mealTimeText}>{item.meal_time}</Text>
        <Text style={styles.priceBadge}>₹ {item.price}</Text>
      </View>
      <Text style={styles.descText}>{item.description}</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
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
        <FlatList
          data={mealList}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No meals available right now.</Text>}
        />
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
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15,
    borderLeftWidth: 4, borderLeftColor: '#3182ce', elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealTimeText: { fontSize: 20, fontWeight: 'bold', color: '#2b6cb0' },
  priceBadge: { backgroundColor: '#c6f6d5', color: '#22543d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: 'bold', fontSize: 16 },
  descText: { fontSize: 15, color: '#4a5568', marginBottom: 16, lineHeight: 22 },
  addBtn: { backgroundColor: '#2b6cb0', padding: 12, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 40, fontSize: 16 },
});
