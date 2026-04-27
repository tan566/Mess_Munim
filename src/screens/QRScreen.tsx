import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRScreen({ route, navigation }: any) {
  const { qrPayload, total, userId } = route.params || {};
  const [used, setUsed] = useState(false);

  const parsedOrder = qrPayload ? JSON.parse(qrPayload) : null;

  const handleDone = () => {
    navigation.replace('StudentDashboard', { userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{used ? '✅ QR Used' : '🎟️ Meal Token'}</Text>
        <Text style={styles.subtitle}>
          {used
            ? 'This QR has been scanned. It is no longer valid.'
            : 'Show this to the mess staff. Valid for one scan only.'}
        </Text>

        <View style={[styles.qrWrapper, used && styles.qrUsed]}>
          {qrPayload && !used ? (
            <QRCode value={qrPayload} size={210} color="#1a202c" backgroundColor="white" />
          ) : (
            <View style={styles.usedPlaceholder}>
              <Text style={styles.usedIcon}>🚫</Text>
              <Text style={styles.usedLabel}>Already Used</Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Row label="Order ID" value={`#${parsedOrder?.orderId ?? '—'}`} />
          <Row label="Amount" value={`₹${total ?? parsedOrder?.amount ?? 0}`} />
          <Row label="Items" value={parsedOrder?.description ?? '—'} />
          <Row label="Status" value={used ? 'Used' : 'Valid — Pending Scan'} highlight={!used} />
        </View>
      </View>

      <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
        <Text style={styles.doneText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2d3748', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#718096', textAlign: 'center', marginBottom: 24 },
  qrWrapper: {
    padding: 12, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 2, borderColor: '#3182ce', marginBottom: 24,
  },
  qrUsed: { borderColor: '#e53e3e', opacity: 0.5 },
  usedPlaceholder: { width: 210, height: 210, justifyContent: 'center', alignItems: 'center' },
  usedIcon: { fontSize: 60 },
  usedLabel: { fontSize: 18, fontWeight: 'bold', color: '#e53e3e', marginTop: 10 },
  infoBox: { width: '100%', backgroundColor: '#f7fafc', borderRadius: 10, padding: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { fontSize: 13, color: '#a0aec0', textTransform: 'uppercase' },
  rowValue: { fontSize: 14, fontWeight: 'bold', color: '#4a5568', flexShrink: 1, textAlign: 'right', maxWidth: '60%' },
  rowHighlight: { color: '#38a169' },
  doneBtn: { marginTop: 24, backgroundColor: '#2b6cb0', padding: 16, borderRadius: 12, alignItems: 'center' },
  doneText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
