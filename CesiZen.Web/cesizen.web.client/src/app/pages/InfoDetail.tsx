import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import type { Information } from '../context/AppDataContext';

export function InfoDetail() {
  const { id } = useParams<{ id: string }>();
  const { getInformationById } = useAppData();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getInformationById(Number(id))
      .then(setInfo)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !info) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">
        <p className="text-lg mb-4">Information introuvable.</p>
        <Link to="/informations" className="text-green-600 hover:underline">← Retour aux ressources</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/informations" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft size={15} /> Retour aux ressources
      </Link>
      <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full mb-4">{info.type}</span>
      <h1 className="text-3xl font-black text-gray-900 mb-3">{info.titre}</h1>
      <p className="text-xs text-gray-400 mb-8">
        Mis à jour le {new Date(info.dateModification).toLocaleDateString('fr-FR')}
      </p>
      <div className="prose prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {info.contenu}
      </div>
    </div>
  );
}