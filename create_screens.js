const fs = require('fs');
const path = require('path');

const screens = [
  'LoginScreen.tsx',
  'StudentDashboard.tsx',
  'MenuScreen.tsx',
  'CartScreen.tsx',
  'QRScreen.tsx',
  'TransactionHistory.tsx',
  'StaffScannerScreen.tsx',
  'AdminDashboard.tsx'
];

const basePath = 'd:/computer_programing/6th_sem/SE Lab/mess_munim/mess-management-app';
screens.forEach(screen => {
  const componentName = screen.replace('.tsx', '');
  const content = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ${componentName}() {
  return (
    <View style={styles.container}>
      <Text>${componentName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
`;
  const filePath = path.join(basePath, 'src/screens', screen);
  fs.writeFileSync(filePath, content);
  console.log('Created: ' + filePath);
});
