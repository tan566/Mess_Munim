import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CartItemProps {
  item: { id: string; name: string; price: number; quantity: number };
  onRemove: () => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹ {(item.price * item.quantity).toFixed(2)}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>
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
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  quantityText: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b6cb0',
  },
  removeBtn: {
    marginTop: 6,
  },
  removeText: {
    color: '#e53e3e',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
