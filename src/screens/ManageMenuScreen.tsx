import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Switch } from 'react-native';
import { meals, mockUpdateMeal } from '../data/mockData';

export default function ManageMenuScreen() {
  const [mealList, setMealList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('0');
  const [editAvail, setEditAvail] = useState(true);

  useEffect(() => {
    setMealList([...meals]);
    setLoading(false);
  }, []);

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setEditDesc(item.description);
    setEditPrice(item.price.toString());
    setEditAvail(Boolean(item.is_available));
  };

  const handleSave = (id: number) => {
    mockUpdateMeal(id, editDesc, parseFloat(editPrice), editAvail);
    setMealList([...meals]);
    setEditingId(null);
    Alert.alert('Success', 'Meal updated!');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <View style={[styles.card, styles.editCard]}>
          <Text style={styles.mealTimeTitle}>{item.meal_time}</Text>
          
          <Text style={styles.label}>Menu Description (e.g. Unlimited Roti):</Text>
          <TextInput style={styles.input} value={editDesc} onChangeText={setEditDesc} multiline />

          <Text style={styles.label}>Plate Rate (₹):</Text>
          <TextInput style={styles.input} value={editPrice} onChangeText={setEditPrice} keyboardType="numeric" />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Available Today?</Text>
            <Switch value={editAvail} onValueChange={setEditAvail} />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingId(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(item.id)}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.mealTimeTitle}>{item.meal_time}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.is_available ? '#c6f6d5' : '#fed7d7' }]}>
            <Text style={[styles.statusText, { color: item.is_available ? '#2f855a' : '#c53030' }]}>
              {item.is_available ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>

        <Text style={styles.descText}>{item.description}</Text>
        
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>₹ {item.price}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => handleEditClick(item)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
      <Text style={styles.screenTitle}>Today's Menu Pricing</Text>
      <FlatList
        data={mealList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf8ff',
    padding: 20,
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editCard: {
    borderColor: '#3182ce',
    borderWidth: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealTimeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  descText: {
    fontSize: 15,
    color: '#4a5568',
    marginBottom: 15,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38a169',
  },
  editBtn: {
    backgroundColor: '#edf2f7',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editText: {
    color: '#2b6cb0',
    fontWeight: 'bold',
  },
  // Edit Form Styles
  label: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#edf2f7',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    padding: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  cancelText: {
    color: '#a0aec0',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#3182ce',
    padding: 15,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
