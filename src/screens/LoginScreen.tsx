import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // Mock Login Logic
    if (email.toLowerCase().includes('staff')) {
      navigation.replace('StaffScannerScreen');
    } else if (email.toLowerCase().includes('admin')) {
      navigation.replace('AdminDashboard');
    } else {
      navigation.replace('StudentDashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logo}>Smart Mess</Text>
        <Text style={styles.subtitle}>Management & Billing System</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email (e.g. student@test.com)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.hintContainer}>
          <Text style={styles.hint}>Mock Login Hints:</Text>
          <Text style={styles.hint}>- Use '*staff*' in email for Staff Flow</Text>
          <Text style={styles.hint}>- Use '*admin*' in email for Admin Flow</Text>
          <Text style={styles.hint}>- Otherwise, logs in as Student</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2b6cb0',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#ebf8ff',
    borderRadius: 8,
  },
  hint: {
    color: '#2b6cb0',
    fontSize: 14,
    marginBottom: 5,
  }
});
