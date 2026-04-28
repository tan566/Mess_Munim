import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { supabase } from '../../lib/supabase';

export default function StaffScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const processPayload = async (payload: string) => {
    try {
      const data = JSON.parse(payload);
      const { userId, type, orderId, amount } = data;

      if (type === 'subscription') {
        const { data: profile } = await supabase.from('profiles').select('status, roll_no').eq('id', userId).single();
        if (!profile || profile.status !== 'approved') {
          Alert.alert('❌ Error', 'Student not approved');
        } else {
          await supabase.from('orders').insert({ user_id: userId, description: 'Subscription Meal', amount: 0, status: 'fulfilled' });
          Alert.alert('✅ Verified!', `Subscription meal approved for ${profile.roll_no}`);
        }
      } else if (type === 'a_la_carte') {
        const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).eq('status', 'pending').single();
        if (!order) { Alert.alert('❌ Error', 'Order not found or already used'); }
        else {
          const { data: profile } = await supabase.from('profiles').select('balance').eq('id', userId).single();
          if (!profile || profile.balance < amount) { Alert.alert('❌ Error', 'Insufficient balance'); }
          else {
            await supabase.from('profiles').update({ balance: profile.balance - amount }).eq('id', userId);
            await supabase.from('orders').update({ status: 'used' }).eq('id', orderId);
            Alert.alert('✅ Verified!', `₹${amount} deducted. Meal approved.`);
          }
        }
      }
    } catch {
      Alert.alert('❌ Error', 'Invalid QR code');
    }
    setScanned(false);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'QR Scanned!',
      `Confirm processing this token?`,
      [
        { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
        { text: 'Confirm', onPress: () => processPayload(data) }
      ]
    );
  };

  const simulateScan = () => {
    // This allows testing on the emulator which doesn't have a camera
    Alert.prompt(
      "Simulate QR Scan",
      "Paste the exact JSON payload from the student's QR code:",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate', onPress: (text) => {
          if(text) {
             setScanned(true);
             processPayload(text);
          }
        }}
      ]
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.accessText}>No access to camera. Please grant permissions to scan tokens.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff QR Scanner</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanBox} />
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Point device at Student's Meal Token QR code.</Text>
        {scanned ? (
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanned(false)}>
            <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.scanAgainBtn, {backgroundColor: '#4a5568'}]} onPress={simulateScan}>
            <Text style={styles.scanAgainText}>Emulator: Simulate Scan</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#1a202c',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#e53e3e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  accessText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#48bb78',
    backgroundColor: 'transparent',
  },
  infoBox: {
    padding: 20,
    backgroundColor: '#1a202c',
    alignItems: 'center',
  },
  infoText: {
    color: '#cbd5e0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  scanAgainBtn: {
    backgroundColor: '#2b6cb0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  scanAgainText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
