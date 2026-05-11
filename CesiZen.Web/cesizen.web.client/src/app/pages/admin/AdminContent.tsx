import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import type { Information } from '../../context/AppDataContext';

interface InfoForm {
  titre: string;
  type: string;
  contenu: string;
}

const DEFAULT_FORM: InfoForm = { titre: '', type: '', contenu: '' };

export function AdminContent() {
  const { getInformations, createInformation, updateInformation, deleteInformation } = useAppData();
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<InfoForm>(DEFAULT_FORM);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const loadInformations = async () => {
    try {
      const data = await getInformations();
      setInformations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInformations(); }, []);

  const startEdit = (info: Information) => {
    setEditingId(info.id);
    setForm({ titre: info.titre, type: info.type, contenu: info.contenu });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId !== null) {
        await updateInformation(editingId, form);
        setEditingId(null);
      } else {
        await createInformation(form);
        setShowForm(false);
      }
      setForm(DEFAULT_FORM);
      await loadInformations();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteInformation(id);
    setInformations(prev => prev.filter(i => i.id !== id));
    setConfirmDelete(null);
  };

  const filtered = informations.filter(i =>
    !search ||
    i.titre.toLowerCase().includes(search.toLowerCase()) ||
    i.type.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  const renderForm = (onCancel: () => void) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
        <input type="text" value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))} required
          maxLength={200} placeholder="Titre de l'information"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <input type="text" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} required
          maxLength={50} placeholder="ex: Article, Guide, Actualité"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
        <textarea value={form.contenu} onChange={e => setForm(p => ({ ...p, contenu: e.target.value }))} required
          rows={8} placeholder="Contenu de l'information..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
          <X size={14} /> Annuler
        </button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-60">
          <Check size={14} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion des contenus</h1>
          <p className="text-gray-500 text-sm mt-1">{informations.length} information{informations.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(DEFAULT_FORM); }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium">
          <Plus size={16} /> Nouvelle information
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-green-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={17} className="text-green-600" /> Nouvelle information
          </h2>
          {renderForm(() => { setShowForm(false); setForm(DEFAULT_FORM); })}
        </div>
      )}

      {editingId !== null && (
        <div className="bg-white rounded-2xl border border-green-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Pencil size={17} className="text-green-600" /> Modifier l'information
          </h2>
          {renderForm(() => { setEditingId(null); setForm(DEFAULT_FORM); })}
        </div>
      )}

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
      </div>

      <div className="space-y-3">
        {filtered.map(info => (
          <div key={info.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{info.type}</span>
                <span className="text-xs text-gray-400">
                  {new Date(info.dateModification).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm truncate">{info.titre}</h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">{info.contenu.substring(0, 100)}…</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => startEdit(info)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Pencil size={15} />
              </button>
              {confirmDelete === info.id ? (
                <div className="flex gap-1 items-center">
                  <button onClick={() => handleDelete(info.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium">Oui</button>
                  <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Non</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(info.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            Aucune information trouvée.
          </div>
        )}
      </div>
    </div>
  );
}