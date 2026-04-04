import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function StaffScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'QR Scanned!',
      `Payload: ${data}\n\nVerify and Confirm Serving?`,
      [
        { text: 'Cancel', onPress: () => setScanned(false), style: 'cancel' },
        { text: 'Confirm', onPress: () => {
            // Mock backend confirmation
            Alert.alert("Success", "Meal confirmed & balance deducted!");
            setScanned(false);
        }}
      ]
    );
  };

  const handleLogout = () => {
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
        {scanned && (
          <TouchableOpacity style={styles.scanAgainBtn} onPress={() => setScanned(false)}>
            <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
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
