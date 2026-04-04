import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MenuItemProps {
  item: { id: string; name: string; price: number; category: string };
  onAdd: () => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>₹ {item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text style={styles.addText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  category: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38a169',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#ebf8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addText: {
    color: '#3182ce',
    fontWeight: 'bold',
  }
});
