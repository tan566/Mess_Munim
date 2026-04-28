import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Linking } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function PendingApprovalsScreen() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<Record<string, string>>({});

  const fetch = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('status', 'pending');
    setApprovals(data ?? []);
    const init: Record<string, string> = {};
    (data ?? []).forEach((u: any) => (init[u.id] = '3000'));
    setBalances(init);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    const balance = parseFloat(balances[userId] || '0');
    const { error } = await supabase.from('profiles').update({
      status: action === 'approve' ? 'approved' : 'rejected',
      ...(action === 'approve' ? { balance } : {}),
    }).eq('id', userId);

    if (error) { Alert.alert('Error', error.message); return; }
    Alert.alert('Done', `Student ${action === 'approve' ? 'approved' : 'rejected'}`);
    setApprovals(prev => prev.filter(a => a.id !== userId));
  };

  const openDoc = async (path: string | null) => {
    if (!path) { Alert.alert('No document uploaded'); return; }
    const { data } = await supabase.storage.from('documents').createSignedUrl(path, 60);
    if (data?.signedUrl) Linking.openURL(data.signedUrl);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2b6cb0" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Approvals</Text>
      {approvals.length === 0 ? (
        <Text style={styles.emptyText}>No pending students!</Text>
      ) : (
        <FlatList
          data={approvals}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Row label="Email"   value={item.email} />
              <Row label="Roll No" value={item.roll_no} />
              <Row label="Hostel"  value={item.hostel} />

              <Text style={styles.docsTitle}>Documents:</Text>
              <View style={styles.docsRow}>
                <TouchableOpacity style={styles.docBtn} onPress={() => openDoc(item.allocation_proof_url)}>
                  <Text style={styles.docBtnText}>Allocation Proof</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.docBtn} onPress={() => openDoc(item.fee_receipt_url)}>
                  <Text style={styles.docBtnText}>Fee Receipt</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Starting Balance (₹):</Text>
              <TextInput
                style={styles.balanceInput}
                value={balances[item.id]}
                onChangeText={t => setBalances(p => ({ ...p, [item.id]: t }))}
                keyboardType="numeric"
              />

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.btn, styles.rejectBtn]} onPress={() => handleAction(item.id, 'reject')}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.approveBtn]} onPress={() => handleAction(item.id, 'approve')}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2d3748', marginBottom: 20 },
  emptyText: { fontSize: 16, color: '#718096', textAlign: 'center', marginTop: 50 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  infoRow: { flexDirection: 'row', marginBottom: 5 },
  label: { fontWeight: 'bold', color: '#4a5568', width: 70 },
  value: { flex: 1, color: '#2d3748' },
  docsTitle: { marginTop: 10, marginBottom: 5, fontWeight: '600', color: '#4a5568' },
  docsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  docBtn: { backgroundColor: '#ebf8ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, borderWidth: 1, borderColor: '#90cdf4', flex: 0.48, alignItems: 'center' },
  docBtnText: { color: '#3182ce', fontSize: 12, fontWeight: '600' },
  balanceInput: { borderWidth: 1, borderColor: '#cbd5e0', borderRadius: 6, padding: 8, marginTop: 5, marginBottom: 15, backgroundColor: '#edf2f7' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 15 },
  btn: { flex: 0.48, paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  rejectBtn: { backgroundColor: '#e53e3e' },
  approveBtn: { backgroundColor: '#38a169' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
