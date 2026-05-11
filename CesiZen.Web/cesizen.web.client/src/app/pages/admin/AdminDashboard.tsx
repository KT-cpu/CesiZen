import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Users, FileText, Smile, Activity, ArrowRight } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import type { Information, Emotion1 } from '../../context/AppDataContext';

interface UtilisateurResponse {
  id: number;
  pseudo: string;
  email: string;
  role: string;
  estActif: boolean;
  dateCreation: string;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<UtilisateurResponse[]>([]);
  const [informations, setInformations] = useState<Information[]>([]);
  const [emotions1, setEmotions1] = useState<Emotion1[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<UtilisateurResponse[]>('/utilisateur'),
      apiClient.get<Information[]>('/information'),
      apiClient.get<Emotion1[]>('/emotion'),
    ])
      .then(([u, i, e]) => {
        setUsers(u);
        setInformations(i);
        setEmotions1(e);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSousEmotions = emotions1.reduce(
    (acc, e1) => acc + e1.emotions2.length, 0
  );

  const stats = [
    {
      label: 'Utilisateurs actifs',
      value: users.filter(u => u.estActif && u.role === 'Utilisateur').length,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      to: '/admin/utilisateurs',
    },
    {
      label: 'Informations publiées',
      value: informations.length,
      icon: FileText,
      color: 'bg-green-50 text-green-600',
      to: '/admin/contenus',
    },
    {
      label: 'Émotions configurées',
      value: totalSousEmotions,
      icon: Smile,
      color: 'bg-amber-50 text-amber-600',
      to: '/admin/emotions',
    },
    {
      label: 'Émotions de base',
      value: emotions1.length,
      icon: Activity,
      color: 'bg-purple-50 text-purple-600',
      to: '/admin/emotions',
    },
  ];

  const recentUsers = [...users]
    .sort((a, b) => b.dateCreation.localeCompare(a.dateCreation))
    .slice(0, 5);

  const recentInfos = [...informations]
    .sort((a, b) => b.dateModification.localeCompare(a.dateModification))
    .slice(0, 5);

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
        <h1 className="text-2xl font-black text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenue dans l'administration de CesiZen</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Link key={i} to={s.to}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={19} />
            </div>
            <div className="text-3xl font-black text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1 flex items-center justify-between">
              {s.label}
              <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 text-green-600 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Utilisateurs récents */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Utilisateurs récents</h2>
            <Link to="/admin/utilisateurs"
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  u.role === 'Administrateur' ? 'bg-amber-500' : 'bg-green-600'
                }`}>
                  {u.pseudo[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{u.pseudo}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.role === 'Administrateur'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role === 'Administrateur' ? 'Admin' : 'Utilisateur'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${u.estActif ? 'bg-green-400' : 'bg-gray-300'}`}
                    title={u.estActif ? 'Actif' : 'Inactif'} />
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-6">Aucun utilisateur.</p>
            )}
          </div>
        </div>

        {/* Informations récentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Informations récentes</h2>
            <Link to="/admin/contenus"
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInfos.map(info => (
              <div key={info.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{info.titre}</p>
                  <p className="text-xs text-gray-500">
                    {info.type} • {new Date(info.dateModification).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            {recentInfos.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-6">Aucune information.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}