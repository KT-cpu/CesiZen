import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/theme';

export default function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, motDePasse);
      router.replace('/(application)/informations');
    } catch (err: any) {
      setError(err.message ?? 'Identifiants invalides.');
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

          {/* Illustration header */}
          <View style={styles.heroSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={44} color={theme.colors.primary} />
            </View>
            <Text style={styles.appName}>CesiZen</Text>
            <Text style={styles.tagline}>Votre santé mentale au quotidien</Text>
          </View>

          {/* Carte formulaire */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connexion</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Adresse email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="vous@exemple.fr"
            />

            <Input
              label="Mot de passe"
              value={motDePasse}
              onChangeText={setMotDePasse}
              secureToggle
              placeholder="••••••••"
            />

            <Button
              label="Se connecter"
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 8 }}
            />
          </View>

          {/* Footer liens */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerRow}
              onPress={() => router.push('/inscription')}>
              <Text style={styles.footerText}>Pas encore de compte ? </Text>
              <Text style={styles.footerLink}>Créer un compte</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() => router.push('/(public)/informations')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.ghostBtnText}>Continuer sans compte</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, padding: theme.spacing.lg, justifyContent: 'center' },
  heroSection: { alignItems: 'center', marginBottom: theme.spacing.xl },
  logoCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  logoEmoji: { fontSize: 40 },
  appName: {
    fontSize: 32, fontWeight: '900', color: theme.colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14, color: theme.colors.textSecondary,
    marginTop: 4, textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl, padding: theme.spacing.lg,
    ...theme.shadow.md,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '800', color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: theme.colors.dangerLight,
    borderRadius: theme.radius.md, padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, color: theme.colors.danger, fontSize: 14, lineHeight: 20 },
  footer: { alignItems: 'center', gap: theme.spacing.md },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 14, color: theme.colors.textSecondary },
  footerLink: { fontSize: 14, color: theme.colors.primary, fontWeight: '700' },
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%',
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { fontSize: 13, color: theme.colors.textMuted },
  ghostBtn: {
    paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: theme.radius.full, borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  ghostBtnText: {
    fontSize: 14, color: theme.colors.textSecondary, fontWeight: '600',
  },
});