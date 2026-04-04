import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

export default function AdminDashboard({ navigation }: any) {
  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Admin View</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today's Revenue</Text>
            <Text style={styles.statValue}>₹ 4,500</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Meals Served</Text>
            <Text style={styles.statValue}>85</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management Console</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👥</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Manage Students</Text>
            <Text style={styles.menuSubtitle}>Add, Edit, View Wallets</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🍽️</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Manage Menu Items</Text>
            <Text style={styles.menuSubtitle}>Update food and prices</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📊</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>View Reports</Text>
            <Text style={styles.menuSubtitle}>Daily and Monthly exports</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
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
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#2b6cb0',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    color: '#ebf8ff',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 4,
  },
  menuArrow: {
    fontSize: 20,
    color: '#cbd5e0',
    fontWeight: 'bold',
  }
});
