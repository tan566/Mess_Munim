import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { mockLogin } from '../data/mockData';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    // Simulate async
    setTimeout(() => {
      const user = mockLogin(email.trim(), password);
      setLoading(false);
      if (!user) {
        Alert.alert('Login Failed', 'Invalid email or password');
        return;
      }
      if (user.role === 'admin') navigation.replace('AdminDashboard');
      else if (user.role === 'staff') navigation.replace('StaffScannerScreen');
      else navigation.replace('StudentDashboard', { userId: user.id });
    }, 500);
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
        
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#4a5568', fontSize: 16 }}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <View style={styles.hintContainer}>
          <Text style={styles.hint}>Test Credentials:</Text>
          <Text style={styles.hint}>Student: student@test.com / 12345678</Text>
          <Text style={styles.hint}>Staff:   staff@test.com / 12345678</Text>
          <Text style={styles.hint}>Admin:   admin@test.com / 12345678</Text>
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
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ebf8ff',
    borderRadius: 8,
  },
  hint: {
    color: '#2b6cb0',
    fontSize: 13,
    marginBottom: 4,
  },
});
