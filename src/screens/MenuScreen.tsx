import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const API_BASE_URL = 'http://192.168.1.24:5000/api';

export default function MenuScreen({ route, navigation }: any) {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrPayload, setQrPayload] = useState('');

  const userId = route.params?.userId || 1; 

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      const data = await res.json();
      setMeals(data.filter((m: any) => m.is_available));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch the daily menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleBuy = (meal: any) => {
    Alert.alert(
      'Confirm Purchase',
      `Buy extra ${meal.meal_time} plate for ₹${meal.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Now', onPress: () => processCheckout(meal) }
      ]
    );
  };

  const processCheckout = async (meal: any) => {
    setPurchasing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/student/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: meal.price,
          description: `Extra ${meal.meal_time} Plate`
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setQrPayload(data.qrPayload);
        setQrModalVisible(true);
      } else {
        Alert.alert('Checkout Failed', data.error || 'Insufficient funds');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network Error', 'Could not process payment.');
    } finally {
      setPurchasing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.mealTimeText}>{item.meal_time}</Text>
        <Text style={styles.priceBadge}>₹ {item.price}</Text>
      </View>
      <Text style={styles.descText}>{item.description}</Text>
      
      <TouchableOpacity 
        style={styles.buyBtn} 
        onPress={() => handleBuy(item)}
        disabled={purchasing}
      >
        <Text style={styles.buyBtnText}>Buy Extra / Guest Plate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Today's Live Menu</Text>
      
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2b6cb0" /></View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No meals available right now.</Text>}
        />
      )}

      {/* QR Code Modal for Successful Checkout */}
      <Modal visible={qrModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Purchase Successful!</Text>
            <Text style={styles.modalSubtitle}>Show this QR code to the mess staff to collect your extra meal.</Text>
            
            <View style={styles.qrWrapper}>
              {qrPayload ? <QRCode value={qrPayload} size={200} /> : null}
            </View>

            <TouchableOpacity 
              style={styles.closeModalBtn} 
              onPress={() => {
                setQrModalVisible(false);
                // Navigate back or refresh wallet dashboard
                navigation.navigate('StudentDashboard');
              }}
            >
              <Text style={styles.closeModalText}>Close & Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 20,
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3182ce',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealTimeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  priceBadge: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  descText: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyText: {
    textAlign: 'center',
    color: '#a0aec0',
    marginTop: 40,
    fontSize: 16,
  },
  buyBtn: {
    backgroundColor: '#edf2f7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal Styles
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38a169',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 25,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 30,
  },
  closeModalBtn: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
  },
  closeModalText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  }
});
