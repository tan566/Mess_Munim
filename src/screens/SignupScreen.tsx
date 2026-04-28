import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../../lib/supabase';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [hostel, setHostel] = useState('');
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

  const uploadFile = async (file: DocumentPicker.DocumentPickerResult, folder: string): Promise<string | null> => {
    if (!file.assets || file.assets.length === 0) return null;
    const asset = file.assets[0];
    const ext = asset.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;

    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error } = await supabase.storage
      .from('documents')
      .upload(path, arrayBuffer, { contentType: asset.mimeType ?? 'application/octet-stream' });

    if (error) { console.error('Upload error:', error); return null; }
    return path;
  };

  const handleSignup = async () => {
    if (!email || !password || !rollNo || !hostel) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
    if (signUpError) {
      setLoading(false);
      Alert.alert('Signup Failed', signUpError.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) { setLoading(false); Alert.alert('Error', 'Signup failed'); return; }

    // 2. Upload documents
    const [allocationPath, receiptPath] = await Promise.all([
      allocationProof ? uploadFile(allocationProof, `allocation/${userId}`) : Promise.resolve(null),
      feeReceipt ? uploadFile(feeReceipt, `receipts/${userId}`) : Promise.resolve(null),
    ]);

    // 3. Create profile (pending approval)
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email: email.trim(),
      roll_no: rollNo.trim(),
      hostel: hostel.trim(),
      role: 'student',
      status: 'pending',
      balance: 0,
      allocation_proof_url: allocationPath,
      fee_receipt_url: receiptPath,
    });

    setLoading(false);

    if (profileError) {
      Alert.alert('Error', 'Failed to save profile: ' + profileError.message);
      return;
    }

    Alert.alert('Success', 'Registration submitted! Waiting for admin approval.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.logo}>Create Account</Text>
        <Text style={styles.subtitle}>Register for Smart Mess</Text>

        <TextInput style={styles.input} placeholder="Official Email (@nitj.ac.in)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password (min 6 chars)" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Roll Number" value={rollNo} onChangeText={setRollNo} />
        <TextInput style={styles.input} placeholder="Hostel Name" value={hostel} onChangeText={setHostel} />

        <TouchableOpacity style={styles.documentButton} onPress={() => pickDocument(setAllocationProof)}>
          <Text style={styles.documentButtonText}>
            {allocationProof?.assets ? '✔️ Allocation Proof Selected' : '📄 Upload Hostel Allocation Proof'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentButton} onPress={() => pickDocument(setFeeReceipt)}>
          <Text style={styles.documentButtonText}>
            {feeReceipt?.assets ? '✔️ Fee Receipt Selected' : '📄 Upload Mess Fee Receipt'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit for Approval</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 40 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#2b6cb0', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#718096', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  documentButton: { backgroundColor: '#ebf8ff', borderWidth: 1, borderColor: '#bee3f8', borderStyle: 'dashed', borderRadius: 8, padding: 15, marginBottom: 15, alignItems: 'center' },
  documentButtonText: { color: '#3182ce', fontSize: 16, fontWeight: '500' },
  button: { backgroundColor: '#2b6cb0', paddingVertical: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});
