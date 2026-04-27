import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
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

const headerStyle = {
  headerStyle: { backgroundColor: '#2b6cb0' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' as const },
  headerBackTitle: 'Back',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={headerStyle}>
        {/* Auth — no header */}
        <Stack.Screen name="Login"  component={LoginScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{
          title: 'Create Account',
          headerShown: true,
        }} />

        {/* Student Flow — dashboard manages its own header */}
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ headerShown: false }} />
        <Stack.Screen name="MenuScreen"        component={MenuScreen}        options={{ title: '🍽️ Today\'s Menu' }} />
        <Stack.Screen name="CartScreen"        component={CartScreen}        options={{ title: '🛒 My Cart' }} />
        <Stack.Screen name="QRScreen"          component={QRScreen}          options={{ title: '🎟️ Meal Token', headerBackVisible: false }} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} options={{ title: '📜 Transactions' }} />

        {/* Staff Flow */}
        <Stack.Screen name="StaffScannerScreen" component={StaffScannerScreen} options={{ headerShown: false }} />

        {/* Admin Flow — dashboard manages its own header */}
        <Stack.Screen name="AdminDashboard"      component={AdminDashboard}         options={{ headerShown: false }} />
        <Stack.Screen name="PendingApprovals"    component={PendingApprovalsScreen} options={{ title: '✅ Pending Approvals' }} />
        <Stack.Screen name="ManageMenu"          component={ManageMenuScreen}       options={{ title: '🍽️ Manage Menu' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
