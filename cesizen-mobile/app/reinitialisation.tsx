import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { apiClient } from '../src/services/apiClient';
import { Input } from '../src/components/Input';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../src/components/Button';
import { theme } from '../src/theme';

export default function Reinitialisation() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string) => (val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    setError('');

    if (form.nouveauMotDePasse !== form.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (form.nouveauMotDePasse.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.put('/utilisateur/me/mot-de-passe', {
        ancienMotDePasse: form.ancienMotDePasse,
        nouveauMotDePasse: form.nouveauMotDePasse,
        confirmationMotDePasse: form.confirmationMotDePasse,
      });
      Alert.alert(
        'Succès',
        'Votre mot de passe a été modifié avec succès.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de la modification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">

          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="chevron-back" size={18} color={theme.colors.primary} />
              <Text style={styles.backText}>Retour</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>Modifier le mot de passe</Text>
          <Text style={styles.subtitle}>
            Bonjour {currentUser?.pseudo}, entrez votre mot de passe actuel puis le nouveau.
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Input
            label="Mot de passe actuel"
            value={form.ancienMotDePasse}
            onChangeText={set('ancienMotDePasse')}
            secureToggle
            placeholder="••••••••"
          />

          <Input
            label="Nouveau mot de passe"
            value={form.nouveauMotDePasse}
            onChangeText={set('nouveauMotDePasse')}
            secureToggle
            placeholder="••••••••"
          />

          <Input
            label="Confirmer le nouveau mot de passe"
            value={form.confirmationMotDePasse}
            onChangeText={set('confirmationMotDePasse')}
            secureToggle
            placeholder="••••••••"
          />

          <Button
            label="Modifier le mot de passe"
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flexGrow: 1, padding: 24 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 15, color: '#2D8A4E', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA',
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  errorText: { color: '#DC2626', fontSize: 14 },
});