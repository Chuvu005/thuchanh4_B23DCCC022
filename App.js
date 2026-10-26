import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SyncProvider } from './src/context/SyncContext';
import { AppDataProvider } from './src/context/AppDataContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Điểm khởi chạy chính của ứng dụng
 * Chỉ bọc các Provider và AppNavigator theo đặc tả mục 5.1
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SyncProvider>
        <AppDataProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AppDataProvider>
      </SyncProvider>
    </SafeAreaProvider>
  );
}
