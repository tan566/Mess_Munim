import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { orders } from '../data/mockData';

export default function TransactionHistory({ route }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId || 1;

  useEffect(() => {
    const userOrders = orders
      .filter(o => o.userId === userId)
      .map(o => ({
        id: o.id,
        type: o.description,
        amount: o.amount,
        date: o.date,
        status: o.description === 'Added Balance' ? 'credit' : o.status,
      }))
      .reverse();
    setTransactions(userOrders);
    setLoading(false);
  }, [userId]);

  const renderItem = ({ item }: any) => {
    const isCredit = item.status === 'credit';
    const isZero = item.amount === 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.typeText}>{item.type}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amountText, 
            isCredit ? styles.creditText : (isZero ? styles.zeroText : styles.debitText)
          ]}>
            {isCredit ? '+' : (isZero ? '' : '-')}₹ {item.amount}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      
      {loading ? (
         <ActivityIndicator size="large" color="#2b6cb0" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    padding: 20,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardInfo: {
    flex: 1,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  dateText: {
    fontSize: 13,
    color: '#a0aec0',
    marginTop: 4,
  },
  amountContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  debitText: {
    color: '#e53e3e',
  },
  creditText: {
    color: '#38a169',
  },
  zeroText: {
    color: '#4a5568',
  }
});
