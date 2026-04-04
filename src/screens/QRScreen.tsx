import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRScreen({ route, navigation }: any) {
  // Try to get totalAmount from params (navigated from Cart), else default to some mock data
  const totalAmount = route?.params?.totalAmount || 0;
  
  // Mock QR payload containing transaction id or token
  const qrPayload = JSON.stringify({
    tokenId: 'MOCK-TOKEN-XYZ123',
    amount: totalAmount,
    timestamp: new Date().toISOString()
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Meal Token</Text>
        <Text style={styles.subtitle}>Show this QR code at the mess counter</Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={qrPayload}
            size={200}
            color="black"
            backgroundColor="white"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Token ID:</Text>
          <Text style={styles.infoValue}>MOCK-TOKEN-XYZ123</Text>
          
          {totalAmount > 0 && (
            <>
              <Text style={styles.infoLabel}>Amount Paid:</Text>
              <Text style={styles.infoValue}>₹ {totalAmount.toFixed(2)}</Text>
            </>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.doneBtn} 
        onPress={() => navigation.navigate('StudentDashboard')}
      >
        <Text style={styles.doneText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f7fafc',
    padding: 15,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#a0aec0',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 10,
  },
  doneBtn: {
    marginTop: 30,
    backgroundColor: '#2b6cb0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
