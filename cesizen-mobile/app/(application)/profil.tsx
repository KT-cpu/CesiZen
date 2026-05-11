import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { apiClient } from '../../src/services/apiClient';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';

export default function Profil() {
  const { currentUser, logout } = useAuth();
  const [pseudo, setPseudo] = useState(currentUser?.pseudo ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await apiClient.put('/utilisateur/me', { pseudo, email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/connexion');
        },
      },
    ]);
  };

  const initial = currentUser?.pseudo?.[0]?.toUpperCase() ?? '?';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Hero profil */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="person" size={14} color={theme.colors.primary} />
            </View>
          </View>
          <Text style={styles.name}>{currentUser?.pseudo}</Text>
          <Text style={styles.emailText}>{currentUser?.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>
              Membre depuis {new Date(currentUser?.dateCreation ?? '').toLocaleDateString('fr-FR', {
                month: 'long', year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Message succès */}
        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successText}> Profil mis à jour avec succès</Text>
          </View>
        )}

        {/* Formulaire */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
          </View>
          <Input label="Pseudo" value={pseudo}
            onChangeText={setPseudo} autoCapitalize="none" />
          <Input label="Email" value={email}
            onChangeText={setEmail} keyboardType="email-address"
            autoCapitalize="none" />
          <Button label="Enregistrer les modifications"
            onPress={handleUpdate} loading={saving} />
        </View>

        {/* Sécurité */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Sécurité</Text>
          </View>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/reinitialisation')}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#EEF2FF' }]}>
                <Ionicons name="key-outline" size={18} color="#5B6EE1" />
              </View>
              <View>
                <Text style={styles.menuLabel}>Modifier le mot de passe</Text>
                <Text style={styles.menuSub}>Changez votre mot de passe</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Danger zone */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { paddingBottom: 40 },
  hero: {
    alignItems: 'center', paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    ...theme.shadow.sm, marginBottom: theme.spacing.lg,
  },
  avatarWrapper: { position: 'relative', marginBottom: theme.spacing.md },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: theme.colors.primaryLight,
  },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: '900' },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: theme.colors.background,
  },
  avatarBadgeText: { fontSize: 14 },
  name: { fontSize: 24, fontWeight: '900', color: theme.colors.text, marginBottom: 4 },
  emailText: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 12 },
  memberBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.full,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  memberBadgeText: { fontSize: 12, color: theme.colors.primary, fontWeight: '600' },
  successBox: {
    backgroundColor: '#F0FDF4', borderRadius: theme.radius.md,
    padding: theme.spacing.md, marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md, alignItems: 'center',
  },
  successText: { color: theme.colors.primary, fontWeight: '600', fontSize: 14 },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl, padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md,
    ...theme.shadow.sm,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: theme.spacing.md,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: theme.colors.text },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 4,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 40, height: 40, borderRadius: theme.radius.md,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
  menuSub: { fontSize: 12, color: theme.colors.textMuted, marginTop: 1 },
  menuArrow: { fontSize: 24, color: theme.colors.textMuted, fontWeight: '300' },
  logoutBtn: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.radius.xl, height: 56,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#FECACA',
  },
  logoutText: { color: theme.colors.danger, fontWeight: '700', fontSize: 15 },
});