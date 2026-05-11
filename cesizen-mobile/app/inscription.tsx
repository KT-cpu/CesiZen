import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';

export default function Inscription() {
  const [form, setForm] = useState({
    pseudo: '', email: '',
    motDePasse: '', confirmationMotDePasse: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const set = (key: string) => (val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const strength = form.motDePasse.length >= 12 ? 3
    : form.motDePasse.length >= 8 ? 2
    : form.motDePasse.length >= 4 ? 1 : 0;

  const strengthColors = ['#E5E7EB', '#EF4444', '#F59E0B', '#2D8A4E'];
  const strengthLabels = ['', 'Faible', 'Moyen', 'Fort'];

  const handleRegister = async () => {
    setError('');
    if (form.motDePasse !== form.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      router.replace('/connexion');
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="chevron-back" size={18} color={theme.colors.primary} />
              <Text style={styles.backText}>Retour</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>
              Rejoignez CesiZen et prenez soin de votre santé mentale
            </Text>
          </View>

          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input label="Pseudo" value={form.pseudo}
              onChangeText={set('pseudo')} autoCapitalize="none"
              placeholder="MonPseudo" />

            <Input label="Email" value={form.email}
              onChangeText={set('email')} keyboardType="email-address"
              autoCapitalize="none" placeholder="vous@exemple.fr" />

            <Input label="Mot de passe" value={form.motDePasse}
              onChangeText={set('motDePasse')} secureToggle
              placeholder="••••••••" />

            {/* Indicateur de force */}
            {form.motDePasse.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map(i => (
                    <View key={i} style={[
                      styles.strengthBar,
                      { backgroundColor: strength >= i ? strengthColors[strength] : '#E5E7EB' },
                    ]} />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
                  {strengthLabels[strength]}
                </Text>
              </View>
            )}

            <Input label="Confirmer le mot de passe"
              value={form.confirmationMotDePasse}
              onChangeText={set('confirmationMotDePasse')} secureToggle
              placeholder="••••••••" />

            <Button label="Créer mon compte" onPress={handleRegister}
              loading={loading} style={{ marginTop: 8 }} />
          </View>

          <TouchableOpacity
            style={styles.footerRow}
            onPress={() => router.push('/connexion')}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <Text style={styles.footerLink}>Se connecter</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: theme.spacing.lg },
  backBtn: { marginBottom: theme.spacing.lg, marginTop: theme.spacing.xs },
  backText: { fontSize: 15, color: theme.colors.primary, fontWeight: '600' },
  header: { marginBottom: theme.spacing.lg },
  title: {
    fontSize: 30, fontWeight: '900', color: theme.colors.text,
    letterSpacing: -0.5, marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22 },
  card: {
    backgroundColor: theme.colors.surface, borderRadius: theme.radius.xl,
    padding: theme.spacing.lg, ...theme.shadow.md, marginBottom: theme.spacing.lg,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.radius.md, padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, color: theme.colors.danger, fontSize: 14 },
  strengthContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: theme.spacing.md, marginTop: -8,
  },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', minWidth: 40 },
  footerRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
  footerLink: { fontSize: 14, color: theme.colors.primary, fontWeight: '700' },
});