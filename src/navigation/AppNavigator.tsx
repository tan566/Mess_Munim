import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import StudentDashboard from '../screens/StudentDashboard';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import QRScreen from '../screens/QRScreen';
import TransactionHistory from '../screens/TransactionHistory';
import StaffScannerScreen from '../screens/StaffScannerScreen';
import AdminDashboard from '../screens/AdminDashboard';
import PendingApprovalsScreen from '../screens/PendingApprovalsScreen';
import ManageMenuScreen from '../screens/ManageMenuScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        
        {/* Student Flow */}
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ title: 'Student Dashboard' }} />
        <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ title: 'Menu' }} />
        <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Cart' }} />
        <Stack.Screen name="QRScreen" component={QRScreen} options={{ title: 'Your QR Code' }} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} options={{ title: 'Transactions' }} />

        {/* Staff Flow */}
        <Stack.Screen name="StaffScannerScreen" component={StaffScannerScreen} options={{ title: 'QR Scanner' }} />

        {/* Admin Flow */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
        <Stack.Screen name="PendingApprovals" component={PendingApprovalsScreen} options={{ title: 'Pending Approvals' }} />
        <Stack.Screen name="ManageMenu" component={ManageMenuScreen} options={{ title: 'Manage Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
