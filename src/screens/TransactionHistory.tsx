import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function TransactionHistory({ route }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTransactions(data ?? []);
        setLoading(false);
      });
  }, [userId]);

  const renderItem = ({ item }: any) => {
    const isCredit = item.amount === 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.typeText}>{item.description}</Text>
          <Text style={styles.dateText}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
        <Text style={[styles.amountText, isCredit ? styles.zeroText : styles.debitText]}>
          {isCredit ? 'Free' : `-₹${item.amount}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2b6cb0" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={i => i.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2d3748', padding: 20, paddingBottom: 10 },
  card: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 12, marginBottom: 12, elevation: 2 },
  cardInfo: { flex: 1 },
  typeText: { fontSize: 16, fontWeight: 'bold', color: '#2d3748' },
  dateText: { fontSize: 13, color: '#a0aec0', marginTop: 4 },
  amountText: { fontSize: 18, fontWeight: 'bold' },
  debitText: { color: '#e53e3e' },
  zeroText: { color: '#4a5568' },
  empty: { textAlign: 'center', color: '#a0aec0', marginTop: 40, fontSize: 16 },
});
