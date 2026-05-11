import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import type { Emotion1 } from '../../context/AppDataContext';

const BASE_COLORS = [
  '#2D8A4E', '#E8593C', '#3B8BD4', '#BA7517',
  '#993556', '#534AB7', '#0F6E56', '#A32D2D',
];

export function AdminEmotions() {
  const { getEmotions, createEmotion1, createEmotion2, deleteEmotion1, deleteEmotion2 } = useAppData();
  const [emotions1, setEmotions1] = useState<Emotion1[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showForm1, setShowForm1] = useState(false);
  const [newNom1, setNewNom1] = useState('');

  const [showForm2, setShowForm2] = useState(false);
  const [newNom2, setNewNom2] = useState('');

  const [confirmDelete1, setConfirmDelete1] = useState<number | null>(null);
  const [confirmDelete2, setConfirmDelete2] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadEmotions = async () => {
    try {
      const data = await getEmotions();
      setEmotions1(data);
      if (!selectedId && data.length > 0) setSelectedId(data[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmotions(); }, []);

  const selectedEmotion1 = emotions1.find(e => e.id === selectedId);
  const selectedIndex = emotions1.findIndex(e => e.id === selectedId);
  const selectedColor = BASE_COLORS[selectedIndex % BASE_COLORS.length];

  const handleAddEmotion1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom1.trim()) return;
    setSaving(true);
    setError('');
    try {
      await createEmotion1(newNom1.trim());
      setNewNom1('');
      setShowForm1(false);
      await loadEmotions();
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddEmotion2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom2.trim() || !selectedId) return;
    setSaving(true);
    setError('');
    try {
      await createEmotion2(newNom2.trim(), selectedId);
      setNewNom2('');
      setShowForm2(false);
      await loadEmotions();
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmotion1 = async (id: number) => {
    try {
      await deleteEmotion1(id);
      if (selectedId === id) setSelectedId(emotions1.find(e => e.id !== id)?.id ?? null);
      await loadEmotions();
      setConfirmDelete1(null);
    } catch (err: any) {
      setError(err.message ?? 'Impossible de supprimer.');
    }
  };

  const handleDeleteEmotion2 = async (id: number) => {
    try {
      await deleteEmotion2(id);
      await loadEmotions();
      setConfirmDelete2(null);
    } catch (err: any) {
      setError(err.message ?? 'Impossible de supprimer.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Configuration des émotions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez les émotions disponibles dans le tracker.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        <p className="font-semibold mb-1">Référentiel d'émotions</p>
        <p>Les émotions sont organisées en 2 niveaux : <strong>émotion de base</strong> (niveau 1) et <strong>émotion spécifique</strong> (niveau 2).</p>
      </div>

      {/* Émotions de base */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900">Émotions de base (niveau 1)</h2>
          <button onClick={() => setShowForm1(!showForm1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700">
            <Plus size={15} /> Ajouter
          </button>
        </div>

        {showForm1 && (
          <form onSubmit={handleAddEmotion1} className="bg-white rounded-xl border border-green-200 p-4 mb-3 flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'émotion de base</label>
              <input type="text" value={newNom1} onChange={e => setNewNom1(e.target.value)}
                placeholder="ex: Sérénité" required autoFocus maxLength={50}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm1(false)}
                className="p-2.5 text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">
                <X size={15} />
              </button>
              <button type="submit" disabled={saving}
                className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60">
                <Check size={15} />
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2">
          {emotions1.map((e1, idx) => (
            <div key={e1.id} className="flex items-center gap-1">
              <button onClick={() => setSelectedId(e1.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all"
                style={selectedId === e1.id
                  ? { backgroundColor: BASE_COLORS[idx % BASE_COLORS.length], borderColor: BASE_COLORS[idx % BASE_COLORS.length], color: 'white' }
                  : { borderColor: '#E5E7EB', color: '#4B5563', backgroundColor: 'white' }}>
                {e1.nom}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${selectedId === e1.id ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {e1.emotions2.length}
                </span>
              </button>
              {confirmDelete1 === e1.id ? (
                <div className="flex gap-1">
                  <button onClick={() => handleDeleteEmotion1(e1.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium">Oui</button>
                  <button onClick={() => setConfirmDelete1(null)} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Non</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete1(e1.id)}
                  className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sous-émotions */}
      {selectedEmotion1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
              <h2 className="font-bold text-gray-900">Sous-émotions : {selectedEmotion1.nom}</h2>
              <span className="text-sm text-gray-500">({selectedEmotion1.emotions2.length})</span>
            </div>
            <button onClick={() => setShowForm2(!showForm2)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700">
              <Plus size={15} /> Ajouter
            </button>
          </div>

          {showForm2 && (
            <form onSubmit={handleAddEmotion2} className="bg-white rounded-xl border border-green-200 p-4 mb-4 flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la sous-émotion</label>
                <input type="text" value={newNom2} onChange={e => setNewNom2(e.target.value)}
                  placeholder="ex: Émerveillement" required autoFocus maxLength={50}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowForm2(false)}
                  className="p-2.5 text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">
                  <X size={15} />
                </button>
                <button type="submit" disabled={saving}
                  className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60">
                  <Check size={15} />
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {selectedEmotion1.emotions2.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Aucune sous-émotion. Cliquez sur "Ajouter" pour en créer une.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {selectedEmotion1.emotions2.map(e2 => (
                  <div key={e2.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedColor }} />
                    <span className="flex-1 text-sm text-gray-900">{e2.nom}</span>
                    {confirmDelete2 === e2.id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDeleteEmotion2(e2.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium">Oui</button>
                        <button onClick={() => setConfirmDelete2(null)} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Non</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete2(e2.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vue d'ensemble */}
      <div className="mt-8">
        <h3 className="font-bold text-gray-900 mb-3">Vue d'ensemble</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {emotions1.map((e1, idx) => (
            <div key={e1.id} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <div className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: BASE_COLORS[idx % BASE_COLORS.length] }} />
              <p className="font-semibold text-sm text-gray-900">{e1.nom}</p>
              <p className="text-xs text-gray-500 mt-0.5">{e1.emotions2.length} sous-émotion{e1.emotions2.length !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}