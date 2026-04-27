import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function StudentDashboard({ navigation, route }: any) {
  const [studentData, setStudentData] = useState({ name: 'Student', rollNo: 'Loading...', walletBalance: 0 });
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId || 1; // Defaulting to user ID 1 for MVP

  useEffect(() => {
    // We add a listener so it refreshes every time the user navigates back to this screen
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const res = await fetch(`http://192.168.1.24:5000/api/student/wallet/${userId}`);
        const data = await res.json();
        if (res.ok) {
           setStudentData({ 
             name: data.email ? data.email.split('@')[0] : 'Student', 
             rollNo: data.roll_no, 
             walletBalance: data.balance 
           });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [navigation, userId]);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const qrPayload = JSON.stringify({ userId, rollNo: studentData.rollNo, type: 'subscription' });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{studentData.name}</Text>
            <Text style={styles.rollNoText}>{studentData.rollNo}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* QR Section */}
        <View style={styles.qrContainer}>
           <Text style={styles.qrTitle}>Mess ID Scan</Text>
           <View style={styles.qrBg}>
             <QRCode value={qrPayload} size={150} backgroundColor="#fff" color="#2d3748" />
           </View>
           <Text style={styles.qrHint}>Show this for Breakfast, Lunch & Dinner</Text>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletTitle}>Current Wallet Balance</Text>
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.walletAmount}>₹ {studentData.walletBalance.toFixed(2)}</Text>
          )}
        </View>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MenuScreen')}>
            <Text style={styles.actionIcon}>🍽️</Text>
            <Text style={styles.actionText}>View Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('TransactionHistory')}>
            <Text style={styles.actionIcon}>📜</Text>
            <Text style={styles.actionText}>Transactions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('QRScreen')}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>Active QR</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: '#718096',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  rollNoText: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#fed7d7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#c53030',
    fontWeight: 'bold',
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  qrBg: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrHint: {
    fontSize: 12,
    color: '#718096',
    marginTop: 15,
  },
  walletCard: {
    backgroundColor: '#2b6cb0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  walletTitle: {
    color: '#ebf8ff',
    fontSize: 16,
    marginBottom: 8,
  },
  walletAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '47%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5568',
    textAlign: 'center',
  }
});
