import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const MOCK_TRANSACTIONS = [
  { id: 'T1001', date: '2023-11-20 13:45', items: 'Veg Thali (1), Paneer Butter Masala (1)', total: 140, status: 'Completed' },
  { id: 'T1002', date: '2023-11-19 20:15', items: 'Chicken Biryani (1)', total: 120, status: 'Completed' },
  { id: 'T1003', date: '2023-11-19 08:30', items: 'Masala Dosa (2)', total: 90, status: 'Completed' },
];

export default function TransactionHistory({ navigation }: any) {
  
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.txId}>#{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.items}>{item.items}</Text>
      <View style={styles.divider} />
      <Text style={styles.amount}>₹ {item.total.toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No recent transactions.</Text>
        )}
      />
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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  txId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38a169',
    backgroundColor: '#f0fff4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  date: {
    fontSize: 12,
    color: '#a0aec0',
    marginBottom: 10,
  },
  items: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b6cb0',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: 16,
    marginTop: 40,
  }
});
