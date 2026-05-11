import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="connexion" />
          <Stack.Screen name="inscription" />
          <Stack.Screen name="reinitialisation" />
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(application)" />
          <Stack.Screen
            name="informations/[informationId]"
            options={{
              headerShown: true,
              headerTitle: 'Information',
              headerTintColor: '#2D8A4E',
              headerBackTitle: 'Retour',
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}