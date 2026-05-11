import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { apiClient } from '../../src/services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/theme';

interface Information {
  id: number; titre: string; type: string;
  contenu: string; dateModification: string;
}

// Couleurs par type d'information
const TYPE_COLORS: Record<string, string> = {
  'Article': '#3B8BD4',
  'Guide': '#2D8A4E',
  'Actualité': '#F5A623',
  'Conseil': '#9B59B6',
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? theme.colors.primary;
}

export default function Informations() {
  const { isAuthenticated } = useAuth();
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await apiClient.get<Information[]>('/information');
      setInformations(data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const types = Array.from(new Set(informations.map(i => i.type)));

  const filtered = informations.filter(i => {
    const matchSearch = !search ||
      i.titre.toLowerCase().includes(search.toLowerCase());
    const matchType = !selectedType || i.type === selectedType;
    return matchSearch && matchType;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchData(); }}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.greeting}>Bienvenue</Text>
                  <Text style={styles.title}>Ressources</Text>
                </View>
                {isAuthenticated ? (
                  <TouchableOpacity
                    style={styles.trackerPill}
                    onPress={() => router.push('/(application)/tracker')}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="heart-outline" size={16} color={theme.colors.primary} />
                      <Text style={styles.trackerPillText}>Tracker</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.loginPill}
                    onPress={() => router.push('/connexion')}>
                    <Text style={styles.loginPillText}>Connexion</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Barre de recherche */}
              <View style={styles.searchWrapper}>
                <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Rechercher une ressource..."
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.searchInput}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Filtres par type */}
              {types.length > 0 && (
                <FlatList
                  horizontal
                  data={['Tous', ...types]}
                  keyExtractor={t => t}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersContainer}
                  renderItem={({ item }) => {
                    const isAll = item === 'Tous';
                    const active = isAll
                      ? selectedType === null
                      : selectedType === item;
                    const color = isAll ? theme.colors.primary : getTypeColor(item);
                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedType(isAll ? null : item)}
                        style={[
                          styles.filterChip,
                          active && { backgroundColor: color, borderColor: color },
                        ]}>
                        <Text style={[
                          styles.filterText,
                          active && { color: '#FFFFFF' },
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}

              <Text style={styles.resultsCount}>
                {filtered.length} ressource{filtered.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucune ressource</Text>
            <Text style={styles.emptySubtitle}>
              Essayez de modifier votre recherche
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const color = getTypeColor(item.type);
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => router.push(`/informations/${item.id}`)}>
              {/* Barre colorée en haut de la carte */}
              <View style={[styles.cardAccent, { backgroundColor: color }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={[styles.typeBadge, { backgroundColor: `${color}18` }]}>
                    <Text style={[styles.typeBadgeText, { color }]}>{item.type}</Text>
                  </View>
                  <Text style={styles.cardDate}>
                    {new Date(item.dateModification).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short',
                    })}
                  </Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.titre}</Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>
                  {item.contenu.substring(0, 100)}…
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.readMore, { color }]}>Lire la suite →</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 32 },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: theme.spacing.lg,
  },
  greeting: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 2 },
  title: {
    fontSize: 32, fontWeight: '900', color: theme.colors.text, letterSpacing: -0.5,
  },
  loginPill: {
    backgroundColor: theme.colors.primary, borderRadius: theme.radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
    ...theme.shadow.sm,
  },
  loginPillText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  trackerPill: {
    backgroundColor: theme.colors.primaryLight, borderRadius: theme.radius.full,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  trackerPillText: { color: theme.colors.primary, fontWeight: '700', fontSize: 14 },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg,
    paddingHorizontal: 16, paddingVertical: 12,
    ...theme.shadow.sm, marginBottom: theme.spacing.md,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1, fontSize: 15, color: theme.colors.text,
  },
  searchClear: { fontSize: 14, color: theme.colors.textMuted, padding: 2 },
  filtersContainer: { paddingBottom: theme.spacing.md, gap: 8 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: theme.radius.full, borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  filterText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  resultsCount: {
    fontSize: 13, color: theme.colors.textMuted,
    marginBottom: 4,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    marginHorizontal: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  cardAccent: { height: 4 },
  cardBody: { padding: theme.spacing.md },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  typeBadge: {
    borderRadius: theme.radius.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 12, fontWeight: '700' },
  cardDate: { fontSize: 12, color: theme.colors.textMuted },
  cardTitle: {
    fontSize: 17, fontWeight: '800', color: theme.colors.text,
    lineHeight: 24, marginBottom: 6,
  },
  cardExcerpt: {
    fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20,
  },
  cardFooter: { marginTop: 12, flexDirection: 'row', justifyContent: 'flex-end' },
  readMore: { fontSize: 13, fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center', paddingTop: 60, paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
});