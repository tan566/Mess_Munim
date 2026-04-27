import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { mockRegisterStudent } from '../data/mockData';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [allocationProof, setAllocationProof] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [feeReceipt, setFeeReceipt] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async (setter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (result.assets && result.assets.length > 0) setter(result);
    } catch (err) {
      console.log('Document picking cancelled', err);
    }
  };

  const handleSignup = () => {
    if (!email || !password || !rollNo) {
      Alert.alert('Error', 'Please fill in all text fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      mockRegisterStudent(email.trim(), rollNo.trim(), 'Boys Hostel 1');
      setLoading(false);
      Alert.alert('Success', 'Registration submitted! Waiting for admin approval.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.logo}>Create Account</Text>
        <Text style={styles.subtitle}>Register for Smart Mess</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Official Email (@nitj.ac.in)"
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

        <TextInput
          style={styles.input}
          placeholder="Roll Number"
          value={rollNo}
          onChangeText={setRollNo}
        />

        <TouchableOpacity style={styles.documentButton} onPress={() => pickDocument(setAllocationProof)}>
          <Text style={styles.documentButtonText}>
            {allocationProof?.assets ? "✔️ Allocation Proof Selected" : "📄 Upload Hostel Allocation Proof"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentButton} onPress={() => pickDocument(setFeeReceipt)}>
          <Text style={styles.documentButtonText}>
            {feeReceipt?.assets ? "✔️ Fee Receipt Selected" : "📄 Upload Mess Fee Receipt"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.buttonText}>Submit for Approval</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
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
  documentButton: {
    backgroundColor: '#ebf8ff',
    borderWidth: 1,
    borderColor: '#bee3f8',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  documentButtonText: {
    color: '#3182ce',
    fontSize: 16,
    fontWeight: '500',
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
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4a5568',
    fontSize: 16,
  }
});
