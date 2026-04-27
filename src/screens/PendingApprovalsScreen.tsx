import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Linking, TextInput } from 'react-native';

const API_BASE_URL = 'http://192.168.1.24:5000/api/admin'; // Change if using physical device

export default function PendingApprovalsScreen() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<{ [key: number]: string }>({});

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pending-approvals`);
      const data = await response.json();
      setApprovals(data);
      // Initialize balance input state
      const initialBals: any = {};
      data.forEach((u: any) => initialBals[u.id] = '3000');
      setBalances(initialBals);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch pending approvals. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (userId: number, action: 'approve' | 'reject') => {
    try {
      const initialBalance = balances[userId] || '0';
      const response = await fetch(`${API_BASE_URL}/approve-student/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, initialBalance })
      });
      
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        // Remove the processed user from the local state list immediately
        setApprovals(prev => prev.filter(a => a.id !== userId));
      } else {
        Alert.alert('Error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error while attempting to process action.');
    }
  };

  const getDocUrl = (docs: any[], type: string) => {
    const doc = docs?.find(d => d.type === type);
    return doc ? `http://localhost:5000${doc.url}` : null;
  };

  const openLink = (url: string | null) => {
    if (url) {
      Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open the file.'));
    } else {
      Alert.alert('No Document', 'This document is missing.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2b6cb0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Approvals</Text>
      
      {approvals.length === 0 ? (
        <Text style={styles.emptyText}>No pending students at the moment!</Text>
      ) : (
        <FlatList
          data={approvals}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{item.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>{item.roll_no}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Hostel:</Text>
                <Text style={styles.value}>{item.hostel_name}</Text>
              </View>

              <Text style={styles.docsTitle}>Attached Documents:</Text>
              <View style={styles.docsContainer}>
                <TouchableOpacity 
                   style={styles.docButton} 
                   onPress={() => openLink(getDocUrl(item.documents, 'allocation_proof'))}>
                  <Text style={styles.docButtonText}>Allocation Proof</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   style={styles.docButton} 
                   onPress={() => openLink(getDocUrl(item.documents, 'fee_receipt'))}>
                  <Text style={styles.docButtonText}>Fee Receipt</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.balanceContainer}>
                <Text style={styles.label}>Starting Balance (₹):</Text>
                <TextInput 
                   style={styles.balanceInput} 
                   value={balances[item.id]} 
                   onChangeText={(t: string) => setBalances(prev => ({...prev, [item.id]: t}))}
                   keyboardType="numeric"
                />
              </View>

              <View style={styles.actionContainer}>
                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleAction(item.id, 'reject')}>
                  <Text style={styles.actionBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleAction(item.id, 'approve')}>
                  <Text style={styles.actionBtnText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 50,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#4a5568',
    width: 70,
  },
  value: {
    flex: 1,
    color: '#2d3748',
  },
  docsTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
    color: '#4a5568',
  },
  docsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  docButton: {
    backgroundColor: '#ebf8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#90cdf4',
    flex: 0.48,
    alignItems: 'center',
  },
  docButtonText: {
    color: '#3182ce',
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingTop: 15,
  },
  actionBtn: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#e53e3e',
  },
  approveBtn: {
    backgroundColor: '#38a169',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  balanceContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  balanceInput: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
    backgroundColor: '#edf2f7',
  }
});
