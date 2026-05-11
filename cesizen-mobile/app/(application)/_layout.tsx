import { Tabs, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';

function TabIcon({
  name, focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? theme.colors.primary : theme.colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  iconWrapperActive: { backgroundColor: theme.colors.primaryLight },
});

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/connexion');
    }
  }, [isAuthenticated, loading]);

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarStyle: {
        height: 72, paddingBottom: 12, paddingTop: 8,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1, borderTopColor: theme.colors.border,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="informations"
        options={{
          title: 'Ressources',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'book' : 'book-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Mon profil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}