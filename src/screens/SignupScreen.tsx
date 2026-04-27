import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, ScrollView, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [hostelId, setHostelId] = useState('1'); // Defaulting to 1 for MVP
  const [allocationProof, setAllocationProof] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [feeReceipt, setFeeReceipt] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const pickDocument = async (setter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        setter(result);
      }
    } catch (err) {
      console.log('Document picking cancelled or failed', err);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !rollNo) {
      Alert.alert('Error', 'Please fill in all text fields');
      return;
    }
    if (!allocationProof || !allocationProof.assets || !feeReceipt || !feeReceipt.assets) {
      Alert.alert('Error', 'Please upload both Allocation Proof and Fee Receipt');
      return;
    }

    setLoading(true);

    try {
      // Setup FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('roll_no', rollNo);
      formData.append('hostel_id', hostelId);

      const allocationAsset = allocationProof.assets[0];
      formData.append('allocationProof', {
        uri: allocationAsset.uri,
        name: allocationAsset.name,
        type: allocationAsset.mimeType || 'application/octet-stream',
      } as any);

      const feeAsset = feeReceipt.assets[0];
      formData.append('feeReceipt', {
        uri: feeAsset.uri,
        name: feeAsset.name,
        type: feeAsset.mimeType || 'application/octet-stream',
      } as any);

      // Use correct base URL for physical devices on local network
      const getBaseUrl = () => {
        return 'http://192.168.1.24:5000/api';
      };

      const response = await fetch(`${getBaseUrl()}/auth/register-student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message || 'Registration submitted for approval.');
        navigation.goBack(); // Go back to login
      } else {
        Alert.alert('Registration Failed', data.error || 'Something went wrong');
      }
    } catch (error) {
       console.error(error);
       Alert.alert('Network Error', 'Could not connect to the server. Make sure the Node server is running and you are using the correct IP address if on a physical device.');
    } finally {
      setLoading(false);
    }
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

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Already have an account? Login here</Text>
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
