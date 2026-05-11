import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, BookOpen } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import type { Information } from '../context/AppDataContext';

export function InfoList() {
  const { getInformations } = useAppData();
  const [informations, setInformations] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFiltre, setTypeFiltre] = useState('');

  useEffect(() => {
    getInformations()
      .then(setInformations)
      .catch(() => setInformations([]))
      .finally(() => setLoading(false));
  }, []);

  const types = Array.from(new Set(informations.map(i => i.type)));

  const filtrees = informations.filter(i => {
    const matchSearch = i.titre.toLowerCase().includes(search.toLowerCase())
      || i.contenu.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFiltre ? i.type === typeFiltre : true;
    return matchSearch && matchType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Informations & Ressources</h1>
        <p className="text-gray-500">Explorez nos ressources sur la santé mentale et le bien-être.</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <select value={typeFiltre} onChange={e => setTypeFiltre(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
          <option value="">Tous les types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtrees.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p>Aucune information trouvée.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrees.map(info => (
            <Link key={info.id} to={`/informations/${info.id}`}
              className="group block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full mb-3">{info.type}</span>
              <h2 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">{info.titre}</h2>
              <p className="text-sm text-gray-500 line-clamp-3">{info.contenu.substring(0, 150)}…</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(info.dateModification).toLocaleDateString('fr-FR')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}