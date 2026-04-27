import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';

export default function TransactionHistory({ route }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Since we only track `orders` in our mock DB right now, we will fetch those.
  // In a real app, this would be `GET /api/student/transactions/:userId`
  const userId = route.params?.userId || 1;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
         const res = await fetch(`http://192.168.1.24:5000/api/admin/pending-approvals`); // Using admin mock route just to get data
         // In reality, we just fake the transaction history based on the MVP since there's no specific route yet
         setTimeout(() => {
           setTransactions([
             { id: 1, type: 'Subscription', amount: 0, date: 'Today, 8:00 AM', status: 'fulfilled' },
             { id: 2, type: 'A la Carte (Paneer)', amount: 40, date: 'Today, 1:15 PM', status: 'fulfilled' },
             { id: 3, type: 'Subscription', amount: 0, date: 'Yesterday, 8:10 PM', status: 'fulfilled' },
             { id: 4, type: 'Added Balance', amount: 3000, date: 'Mon, 10:00 AM', status: 'credit' }
           ]);
           setLoading(false);
         }, 800);
      } catch (err) {
         setLoading(false);
      }
    };
    fetchHistory();
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
