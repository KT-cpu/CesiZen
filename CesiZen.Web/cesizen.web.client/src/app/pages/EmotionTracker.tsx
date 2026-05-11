import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Plus, Pencil, Trash2, BarChart2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import type { TrackerEmotion, Emotion1 } from '../context/AppDataContext';

//Palette de couleurs par index pour les émotions de base
const BASE_COLORS = [
  '#2D8A4E', '#E8593C', '#3B8BD4', '#BA7517',
  '#993556', '#534AB7', '#0F6E56', '#A32D2D',
];

function getColor(index: number) {
  return BASE_COLORS[index % BASE_COLORS.length];
}

interface EntryFormProps {
  emotions1: Emotion1[];
  initial?: TrackerEmotion;
  onSave: (emotion2Id: number, dateSaisie: string) => Promise<void>;
  onCancel: () => void;
}

function EntryForm({ emotions1, initial, onSave, onCancel }: EntryFormProps) {
  const [selectedEmotion1Id, setSelectedEmotion1Id] = useState<number>(
    initial?.emotion1Id ?? (emotions1[0]?.id ?? 0)
  );
  const [selectedEmotion2Id, setSelectedEmotion2Id] = useState<number>(
    initial?.emotion2Id ?? 0
  );
  const [date, setDate] = useState(
    initial?.dateSaisie
      ? initial.dateSaisie.split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [saving, setSaving] = useState(false);

  const currentEmotion1 = emotions1.find(e => e.id === selectedEmotion1Id);
  const emotion1Index = emotions1.findIndex(e => e.id === selectedEmotion1Id);

  const handleEmotion1Change = (id: number) => {
    setSelectedEmotion1Id(id);
    setSelectedEmotion2Id(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion2Id) return;
    setSaving(true);
    try {
      await onSave(selectedEmotion2Id, new Date(date).toISOString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]} required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Émotion de base</label>
        <div className="flex flex-wrap gap-2">
          {emotions1.map((e1, idx) => (
            <button key={e1.id} type="button" onClick={() => handleEmotion1Change(e1.id)}
              className="px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all"
              style={selectedEmotion1Id === e1.id
                ? { backgroundColor: getColor(idx), borderColor: getColor(idx), color: 'white' }
                : { borderColor: '#E5E7EB', color: '#4B5563', backgroundColor: 'white' }}>
              {e1.nom}
            </button>
          ))}
        </div>
      </div>

      {currentEmotion1 && currentEmotion1.emotions2.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Émotion spécifique</label>
          <div className="flex flex-wrap gap-2">
            {currentEmotion1.emotions2.map(e2 => (
              <button key={e2.id} type="button" onClick={() => setSelectedEmotion2Id(e2.id)}
                className="px-3 py-1.5 rounded-full text-sm border-2 transition-all"
                style={selectedEmotion2Id === e2.id
                  ? { backgroundColor: getColor(emotion1Index), borderColor: getColor(emotion1Index), color: 'white' }
                  : { borderColor: '#E5E7EB', color: '#4B5563', backgroundColor: 'white' }}>
                {e2.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
          <X size={15} /> Annuler
        </button>
        <button type="submit" disabled={!selectedEmotion2Id || saving}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-40">
          <Check size={15} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

export function EmotionTracker() {
  const { currentUser } = useAuth();
  const { getJournal, addTrackerEntry, updateTrackerEntry, deleteTrackerEntry, getEmotions } = useAppData();

  const [entries, setEntries] = useState<TrackerEmotion[]>([]);
  const [emotions1, setEmotions1] = useState<Emotion1[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TrackerEmotion | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [journal, emotions] = await Promise.all([getJournal(), getEmotions()]);
      setEntries(journal);
      setEmotions1(emotions);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (emotion2Id: number, dateSaisie: string) => {
    await addTrackerEntry(emotion2Id, dateSaisie);
    await loadData();
    setShowForm(false);
  };

  const handleUpdate = async (emotion2Id: number, dateSaisie: string) => {
    if (!editingEntry) return;
    await updateTrackerEntry(editingEntry.id, emotion2Id, dateSaisie);
    await loadData();
    setEditingEntry(null);
  };

  const handleDelete = async (id: number) => {
    await deleteTrackerEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    setConfirmDelete(null);
  };

  // Groupement par date
  const grouped = entries.reduce((acc, entry) => {
    const d = entry.dateSaisie.split('T')[0];
    if (!acc[d]) acc[d] = [];
    acc[d].push(entry);
    return acc;
  }, {} as Record<string, TrackerEmotion[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const emotion1Index = (nom: string) =>
    emotions1.findIndex(e => e.nom === nom);

  if (!currentUser) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Journal d'émotions</h1>
          <p className="text-gray-500 text-sm mt-1">
            {entries.length} entrée{entries.length !== 1 ? 's' : ''} enregistrée{entries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/tracker/rapport"
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 bg-white">
            <BarChart2 size={16} /> Rapport
          </Link>
          <button onClick={() => { setShowForm(true); setEditingEntry(null); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700">
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {showForm && !editingEntry && (
        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={17} className="text-green-600" /> Nouvelle entrée
          </h2>
          <EntryForm emotions1={emotions1} onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {entries.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4"></div>
          <h3 className="font-bold text-gray-900 mb-2">Commencez votre journal</h3>
          <p className="text-gray-500 text-sm mb-5">Enregistrez vos émotions pour mieux vous comprendre.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 text-sm font-medium">
            <Plus size={16} /> Ajouter ma première émotion
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="text-sm font-semibold text-gray-500 mb-3 sticky top-20 bg-gray-50 py-1">
                {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
              <div className="space-y-3">
                {grouped[date].map(entry => (
                  <div key={entry.id}>
                    {editingEntry?.id === entry.id ? (
                      <div className="bg-white rounded-2xl border border-green-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4">Modifier l'entrée</h3>
                        <EntryForm emotions1={emotions1} initial={entry}
                          onSave={handleUpdate} onCancel={() => setEditingEntry(null)} />
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ backgroundColor: getColor(emotion1Index(entry.emotion1Nom)) }}>
                          {entry.emotion1Nom.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900">{entry.emotion2Nom}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: getColor(emotion1Index(entry.emotion1Nom)) }}>
                              {entry.emotion1Nom}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={() => { setEditingEntry(entry); setShowForm(false); }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Pencil size={15} />
                          </button>
                          {confirmDelete === entry.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDelete(entry.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium">Oui</button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs">Non</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(entry.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}