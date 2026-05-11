import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../src/services/apiClient';
import { theme } from '../../src/theme';

interface Emotion1 {
  id: number; nom: string;
  emotions2: { id: number; nom: string }[];
}

interface TrackerEmotion {
  id: number;
  dateSaisie: string;
  emotion2Id: number;
  emotion2Nom: string;
  emotion1Id: number;
  emotion1Nom: string;
}

type ModalMode = 'add' | 'edit' | 'rapport' | null;
type Period = 'week' | 'month' | 'quarter' | 'year';

const COLORS = ['#2D8A4E','#E8593C','#3B8BD4','#BA7517','#993556','#534AB7'];

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Cette semaine',
  month: 'Ce mois',
  quarter: 'Ce trimestre',
  year: 'Cette année',
};

const PERIOD_DAYS: Record<Period, number> = {
  week: 7, month: 30, quarter: 90, year: 365,
};

interface RapportEmotion {
  debut: string;
  fin: string;
  totalEntrees: number;
  statistiquesParEmotion1: {
    emotion1Nom: string;
    nombreOccurrences: number;
    pourcentage: number;
  }[];
}

export default function Tracker() {
  const [entries, setEntries] = useState<TrackerEmotion[]>([]);
  const [emotions1, setEmotions1] = useState<Emotion1[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingEntry, setEditingEntry] = useState<TrackerEmotion | null>(null);
  const [selectedE1, setSelectedE1] = useState<Emotion1 | null>(null);
  const [selectedE2Id, setSelectedE2Id] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState<Period>('month');
  const [rapport, setRapport] = useState<RapportEmotion | null>(null);
  const [rapportLoading, setRapportLoading] = useState(false);

  const load = async () => {
    try {
      const [journal, emo] = await Promise.all([
        apiClient.get<TrackerEmotion[]>('/trackeremotion'),
        apiClient.get<Emotion1[]>('/emotion'),
      ]);
      setEntries(journal);
      setEmotions1(emo);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const loadRapport = async (p: Period) => {
    setRapportLoading(true);
    const fin = new Date();
    const debut = new Date();
    debut.setDate(debut.getDate() - PERIOD_DAYS[p]);
    try {
      const data = await apiClient.get<RapportEmotion>(
        `/trackeremotion/rapport?debut=${debut.toISOString()}&fin=${fin.toISOString()}`
      );
      setRapport(data);
    } catch {}
    finally { setRapportLoading(false); }
  };

  const openAdd = () => {
    setEditingEntry(null);
    setSelectedE1(emotions1[0] ?? null);
    setSelectedE2Id(null);
    setModalMode('add');
  };

  const openEdit = (entry: TrackerEmotion) => {
    setEditingEntry(entry);
    const e1 = emotions1.find(e => e.nom === entry.emotion1Nom) ?? null;
    setSelectedE1(e1);
    setSelectedE2Id(entry.emotion2Id);
    setModalMode('edit');
  };

  const openRapport = () => {
    setModalMode('rapport');
    loadRapport(period);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingEntry(null);
    setSelectedE1(null);
    setSelectedE2Id(null);
  };

  const handleSave = async () => {
    if (!selectedE2Id) return;
    setSaving(true);
    try {
      if (modalMode === 'edit' && editingEntry) {
        await apiClient.put(`/trackeremotion/${editingEntry.id}`, {
          emotion2Id: selectedE2Id,
          dateSaisie: editingEntry.dateSaisie,
        });
      } else {
        await apiClient.post('/trackeremotion', {
          emotion2Id: selectedE2Id,
          dateSaisie: new Date().toISOString(),
        });
      }
      closeModal();
      await load();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Supprimer', 'Supprimer cette entrée ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          await apiClient.delete(`/trackeremotion/${id}`);
          setEntries(prev => prev.filter(e => e.id !== id));
        },
      },
    ]);
  };

  const getColor = (nom: string) => {
    const idx = emotions1.findIndex(e => e.nom === nom);
    return COLORS[idx % COLORS.length] ?? '#6B7280';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2D8A4E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal d'émotions</Text>
          <View style={styles.headerBtns}>
            <TouchableOpacity style={styles.rapportBtn} onPress={openRapport}>
              <Ionicons name="bar-chart-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
              <Text style={styles.addBtnText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={entries}
          keyExtractor={item => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Aucune entrée. Commencez à suivre vos émotions !
            </Text>
          }
          renderItem={({ item }) => {
            const color = getColor(item.emotion1Nom);
            return (
              <View style={styles.card}>
                <View style={[styles.dot, { backgroundColor: color }]}>
                  <Text style={styles.dotText}>
                    {item.emotion1Nom.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.emotion2}>{item.emotion2Nom}</Text>
                  <Text style={[styles.emotion1, { color }]}>{item.emotion1Nom}</Text>
                  <Text style={styles.date}>
                    {new Date(item.dateSaisie).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => openEdit(item)}
                    style={styles.editBtn}>
                    <Ionicons name="create-outline" size={18} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Modal ajout / modification */}
      <Modal
        visible={modalMode === 'add' || modalMode === 'edit'}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalMode === 'edit' ? 'Modifier l\'émotion' : 'Nouvelle émotion'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Émotion de base</Text>
          <View style={styles.chips}>
            {emotions1.map((e1, idx) => (
              <TouchableOpacity
                key={e1.id}
                onPress={() => { setSelectedE1(e1); setSelectedE2Id(null); }}
                style={[
                  styles.chip,
                  selectedE1?.id === e1.id && {
                    backgroundColor: COLORS[idx % COLORS.length],
                    borderColor: COLORS[idx % COLORS.length],
                  },
                ]}>
                <Text style={[
                  styles.chipText,
                  selectedE1?.id === e1.id && { color: '#FFFFFF' },
                ]}>
                  {e1.nom}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedE1 && (
            <>
              <Text style={styles.sectionLabel}>Émotion spécifique</Text>
              <View style={styles.chips}>
                {selectedE1.emotions2.map(e2 => {
                  const idx = emotions1.findIndex(e => e.id === selectedE1.id);
                  const color = COLORS[idx % COLORS.length];
                  return (
                    <TouchableOpacity
                      key={e2.id}
                      onPress={() => setSelectedE2Id(e2.id)}
                      style={[
                        styles.chip,
                        selectedE2Id === e2.id && {
                          backgroundColor: color, borderColor: color,
                        },
                      ]}>
                      <Text style={[
                        styles.chipText,
                        selectedE2Id === e2.id && { color: '#FFFFFF' },
                      ]}>
                        {e2.nom}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={handleSave}
            disabled={!selectedE2Id || saving}
            style={[styles.saveBtn, (!selectedE2Id || saving) && { opacity: 0.4 }]}>
            <Text style={styles.saveBtnText}>
              {saving ? 'Enregistrement...' : modalMode === 'edit' ? 'Modifier' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Modal rapport */}
      <Modal
        visible={modalMode === 'rapport'}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rapport d'émotions</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Sélecteur de période */}
          <View style={styles.periodContainer}>
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => {
                  setPeriod(p);
                  loadRapport(p);
                }}
                style={[
                  styles.periodBtn,
                  period === p && styles.periodBtnActive,
                ]}>
                <Text style={[
                  styles.periodText,
                  period === p && styles.periodTextActive,
                ]}>
                  {PERIOD_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {rapportLoading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#2D8A4E" />
            </View>
          ) : !rapport || rapport.totalEntrees === 0 ? (
            <View style={styles.center}>
              <Text style={styles.empty}>
                Aucune donnée sur cette période.
              </Text>
            </View>
          ) : (
            <FlatList
              data={rapport.statistiquesParEmotion1}
              keyExtractor={item => item.emotion1Nom}
              contentContainerStyle={{ padding: 16 }}
              ListHeaderComponent={
                <View style={styles.rapportTotal}>
                  <Text style={styles.rapportTotalLabel}>Total d'entrées</Text>
                  <Text style={styles.rapportTotalValue}>{rapport.totalEntrees}</Text>
                </View>
              }
              renderItem={({ item, index }) => {
                const color = COLORS[index % COLORS.length];
                return (
                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <View style={[styles.statDot, { backgroundColor: color }]} />
                      <Text style={styles.statNom}>{item.emotion1Nom}</Text>
                      <Text style={styles.statCount}>{item.nombreOccurrences}x</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View style={[
                        styles.bar,
                        {
                          width: `${item.pourcentage}%` as any,
                          backgroundColor: color,
                        },
                      ]} />
                    </View>
                    <Text style={styles.statPct}>{item.pourcentage}%</Text>
                  </View>
                );
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  headerBtns: { flexDirection: 'row', gap: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addBtn: {
    backgroundColor: '#2D8A4E', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  rapportBtn: {
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  rapportBtnText: { fontSize: 18 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#F3F4F6',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  dot: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  dotText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  emotion2: { fontSize: 16, fontWeight: '700', color: '#111827' },
  emotion1: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  date: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 4 },
  editBtn: { padding: 8 },
  editBtnText: { fontSize: 16 },
  deleteBtn: { padding: 8 },
  deleteBtnText: { fontSize: 16 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 60, fontSize: 15 },
  modal: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  modalClose: { fontSize: 20, color: '#6B7280', padding: 4 },
  sectionLabel: {
    fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  saveBtn: {
    backgroundColor: '#2D8A4E', borderRadius: 14, height: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 'auto',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  periodContainer: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    paddingHorizontal: 16, marginBottom: 16,
  },
  periodBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  periodBtnActive: { backgroundColor: '#2D8A4E', borderColor: '#2D8A4E' },
  periodText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  periodTextActive: { color: '#FFFFFF' },
  rapportTotal: {
    backgroundColor: '#F0FDF4', borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 16,
  },
  rapportTotalLabel: { fontSize: 14, color: '#6B7280' },
  rapportTotalValue: {
    fontSize: 48, fontWeight: '800', color: '#2D8A4E', marginTop: 4,
  },
  statCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6',
  },
  statHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
  },
  statDot: { width: 12, height: 12, borderRadius: 6 },
  statNom: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111827' },
  statCount: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  barContainer: {
    height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, marginBottom: 4,
  },
  bar: { height: 8, borderRadius: 4 },
  statPct: { fontSize: 12, color: '#9CA3AF', textAlign: 'right' },
});