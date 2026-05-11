import React, { useState, useEffect } from 'react';
import { Search, Pencil, Trash2, X, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

interface UtilisateurResponse {
  id: number;
  pseudo: string;
  email: string;
  role: string;
  estActif: boolean;
  dateCreation: string;
}

interface EditForm {
  pseudo: string;
  email: string;
  role: string;
  estActif: boolean;
}

export function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UtilisateurResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ pseudo: '', email: '', role: 'Utilisateur', estActif: true });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const loadUsers = async () => {
    try {
      const data = await apiClient.get<UtilisateurResponse[]>('/utilisateur');
      setUsers(data);
    } catch {
      showMessage('Erreur lors du chargement des utilisateurs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const startEdit = (user: UtilisateurResponse) => {
    setEditingId(user.id);
    setEditForm({ pseudo: user.pseudo, email: user.email, role: user.role, estActif: user.estActif });
  };

  const handleUpdate = async (id: number) => {
    try {
      await apiClient.put(`/utilisateur/${id}`, editForm);
      await loadUsers();
      setEditingId(null);
      showMessage('Compte mis à jour avec succès.');
    } catch (err: any) {
      showMessage(err.message ?? 'Erreur lors de la mise à jour.', 'error');
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/utilisateur/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setConfirmDelete(null);
      showMessage('Compte supprimé.');
    } catch (err: any) {
      showMessage(err.message ?? 'Erreur lors de la suppression.', 'error');
    }
  };

  const filtered = users.filter(u =>
    !search || `${u.pseudo} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} compte{users.length !== 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
          messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {messageType === 'error' ? <AlertCircle size={16} /> : <Check size={16} />} {message}
        </div>
      )}

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${user.role === 'Administrateur' ? 'bg-amber-500' : 'bg-green-600'}`}>
                          {user.pseudo[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.pseudo}</p>
                          <p className="text-xs text-gray-400">Inscrit le {new Date(user.dateCreation).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${user.role === 'Administrateur' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user.role === 'Administrateur' && <ShieldCheck size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${user.estActif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.estActif ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {user.estActif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(user)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        {user.id !== currentUser?.id && (
                          confirmDelete === user.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => handleDelete(user.id)} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium">Oui</button>
                              <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg">Non</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(user.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                  {editingId === user.id && (
                    <tr>
                      <td colSpan={5} className="px-5 py-4 bg-green-50 border-b border-green-100">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Pseudo</label>
                            <input type="text" value={editForm.pseudo} onChange={e => setEditForm(p => ({ ...p, pseudo: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Rôle</label>
                            <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                              <option value="Utilisateur">Utilisateur</option>
                              <option value="Administrateur">Administrateur</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Statut</label>
                            <select value={editForm.estActif ? 'actif' : 'inactif'} onChange={e => setEditForm(p => ({ ...p, estActif: e.target.value === 'actif' }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                              <option value="actif">Actif</option>
                              <option value="inactif">Inactif</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-3">
                          <button onClick={() => setEditingId(null)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <X size={14} /> Annuler
                          </button>
                          <button onClick={() => handleUpdate(user.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <Check size={14} /> Enregistrer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Aucun utilisateur trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
}