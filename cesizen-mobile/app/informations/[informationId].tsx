import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../src/services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';

interface Information {
  id: number; titre: string; type: string;
  contenu: string; dateModification: string;
}

const TYPE_COLORS: Record<string, string> = {
  'Article': '#3B8BD4',
  'Guide': '#2D8A4E',
  'Actualité': '#F5A623',
  'Conseil': '#9B59B6',
};

export default function InfoDetail() {
  const { informationId } = useLocalSearchParams<{ informationId: string }>();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!informationId) { setLoading(false); return; }
    apiClient.get<Information>(`/information/${informationId}`)
      .then(setInfo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [informationId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!info) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.notFoundTitle}>Information introuvable</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="chevron-back" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.backBtnText}>Retour</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const color = TYPE_COLORS[info.type] ?? theme.colors.primary;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Hero coloré */}
        <View style={[styles.hero, { backgroundColor: `${color}12` }]}>
          <View style={[styles.typeBadge, { backgroundColor: `${color}22` }]}>
            <Text style={[styles.typeBadgeText, { color }]}>{info.type}</Text>
          </View>
          <Text style={styles.title}>{info.titre}</Text>
          <Text style={styles.date}>
            Mis à jour le {new Date(info.dateModification).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
        </View>

        {/* Contenu */}
        <View style={styles.content}>
          <View style={[styles.accentBar, { backgroundColor: color }]} />
          <Text style={styles.contentText}>{info.contenu}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  container: { paddingBottom: 40 },
  hero: { padding: theme.spacing.lg, paddingTop: theme.spacing.md },
  backBtn: { marginBottom: theme.spacing.md },
  backBtnText: { fontSize: 15, color: theme.colors.textSecondary, fontWeight: '600' },
  typeBadge: {
    alignSelf: 'flex-start', borderRadius: theme.radius.full,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12,
  },
  typeBadgeText: { fontSize: 13, fontWeight: '700' },
  title: {
    fontSize: 26, fontWeight: '900', color: theme.colors.text,
    lineHeight: 34, marginBottom: 10, letterSpacing: -0.3,
  },
  date: { fontSize: 13, color: theme.colors.textSecondary },
  content: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg, borderRadius: theme.radius.xl,
    padding: theme.spacing.lg, ...theme.shadow.sm,
  },
  accentBar: {
    height: 3, width: 40, borderRadius: 2, marginBottom: theme.spacing.md,
  },
  contentText: {
    fontSize: 16, color: theme.colors.text,
    lineHeight: 28, letterSpacing: 0.1,
  },
  bottomBackBtn: {
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg, borderWidth: 1.5,
    paddingVertical: 14, alignItems: 'center',
  },
  bottomBackBtnText: { fontSize: 15, fontWeight: '700' },
  notFoundEmoji: { fontSize: 48, marginBottom: 12 },
  notFoundTitle: {
    fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 20,
  },
  backBtnCenter: {
    backgroundColor: theme.colors.primaryLight, borderRadius: theme.radius.full,
    paddingHorizontal: 24, paddingVertical: 12,
  },
  backBtnCenterText: { color: theme.colors.primary, fontWeight: '700' },
});