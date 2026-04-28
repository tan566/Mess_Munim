import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../../lib/supabase';

export default function StudentDashboard({ navigation, route }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = route.params?.userId;

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchProfile);
    return unsubscribe;
  }, [navigation, userId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const qrPayload = JSON.stringify({ userId, rollNo: profile?.roll_no, type: 'subscription' });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{profile?.email?.split('@')[0] ?? '...'}</Text>
            <Text style={styles.rollNoText}>{profile?.roll_no}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Mess ID Scan</Text>
          <View style={styles.qrBg}>
            <QRCode value={qrPayload} size={150} backgroundColor="#fff" color="#2d3748" />
          </View>
          <Text style={styles.qrHint}>Show this for Breakfast, Lunch & Dinner</Text>
        </View>

        <View style={styles.walletCard}>
          <Text style={styles.walletTitle}>Current Wallet Balance</Text>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.walletAmount}>₹ {Number(profile?.balance ?? 0).toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MenuScreen', { userId })}>
            <Text style={styles.actionIcon}>🍽️</Text>
            <Text style={styles.actionText}>View Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('TransactionHistory', { userId })}>
            <Text style={styles.actionIcon}>📜</Text>
            <Text style={styles.actionText}>Transactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('CartScreen', { userId })}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>My Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { fontSize: 16, color: '#718096' },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#2d3748' },
  rollNoText: { fontSize: 14, color: '#a0aec0', marginTop: 2 },
  logoutBtn: { backgroundColor: '#fed7d7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#c53030', fontWeight: 'bold' },
  qrContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 30, elevation: 3 },
  qrTitle: { fontSize: 18, fontWeight: 'bold', color: '#2d3748', marginBottom: 15 },
  qrBg: { padding: 10, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  qrHint: { fontSize: 12, color: '#718096', marginTop: 15 },
  walletCard: { backgroundColor: '#2b6cb0', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 30, elevation: 4 },
  walletTitle: { color: '#ebf8ff', fontSize: 16, marginBottom: 8 },
  walletAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { backgroundColor: '#fff', width: '47%', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 16, elevation: 2 },
  actionIcon: { fontSize: 32, marginBottom: 12 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#4a5568', textAlign: 'center' },
});
