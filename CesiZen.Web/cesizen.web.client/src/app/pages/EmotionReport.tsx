import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, BarChart2, PieChart as PieChartIcon, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppData } from '../context/AppDataContext';
import type { RapportEmotion } from '../context/AppDataContext';

type Period = 'week' | 'month' | 'quarter' | 'year';

const PERIOD_LABELS: Record<Period, string> = {
  week: 'Cette semaine',
  month: 'Ce mois',
  quarter: 'Ce trimestre',
  year: 'Cette année',
};

const PERIOD_DAYS: Record<Period, number> = {
  week: 7, month: 30, quarter: 90, year: 365,
};

const BASE_COLORS = [
  '#2D8A4E', '#E8593C', '#3B8BD4', '#BA7517',
  '#993556', '#534AB7', '#0F6E56', '#A32D2D',
];

export function EmotionReport() {
  const { getRapport } = useAppData();
  const [period, setPeriod] = useState<Period>('month');
  const [rapport, setRapport] = useState<RapportEmotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fin = new Date();
    const debut = new Date();
    debut.setDate(debut.getDate() - PERIOD_DAYS[period]);

    setLoading(true);
    getRapport(debut.toISOString(), fin.toISOString())
      .then(setRapport)
      .catch(() => setRapport(null))
      .finally(() => setLoading(false));
  }, [period]);

  const pieData = useMemo(() =>
    (rapport?.statistiquesParEmotion1 ?? []).map((s, idx) => ({
      name: s.emotion1Nom,
      value: s.nombreOccurrences,
      color: BASE_COLORS[idx % BASE_COLORS.length],
    })),
    [rapport]
  );

  const barData = useMemo(() => {
    if (!rapport) return [];
    const counts: Record<string, { count: number; colorIdx: number }> = {};
    rapport.entrees.forEach(e => {
      if (!counts[e.emotion2Nom]) {
        const idx = rapport.statistiquesParEmotion1
          .findIndex(s => s.emotion1Nom === e.emotion1Nom);
        counts[e.emotion2Nom] = { count: 0, colorIdx: idx };
      }
      counts[e.emotion2Nom].count++;
    });
    return Object.entries(counts)
      .map(([name, { count, colorIdx }]) => ({
        name, value: count,
        color: BASE_COLORS[colorIdx % BASE_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [rapport]);

  const dominantEmotion = pieData[0]?.name ?? '–';
  const avgIntensity = '–';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/tracker" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Retour au journal
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Rapport d'émotions</h1>
          <p className="text-gray-500 text-sm mt-1">Analysez vos tendances émotionnelles</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
              }`}>
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Entrées', value: rapport?.totalEntrees ?? 0, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
              { label: 'Émotion dominante', value: dominantEmotion, icon: PieChartIcon, color: 'text-amber-600 bg-amber-50' },
              { label: 'Intensité moyenne', value: avgIntensity, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
              { label: 'Émotions distinctes', value: new Set(rapport?.entrees.map(e => e.emotion2Nom)).size ?? 0, icon: BarChart2, color: 'text-purple-600 bg-purple-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon size={18} />
                </div>
                <div className="text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {!rapport || rapport.totalEntrees === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <BarChart2 size={48} className="mx-auto mb-3 text-gray-300" />
              <h3 className="font-bold text-gray-900 mb-2">Aucune donnée sur cette période</h3>
              <p className="text-gray-500 text-sm">Ajoutez des entrées dans votre journal pour voir vos rapports.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChartIcon size={17} className="text-green-600" /> Répartition des émotions de base
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val} fois`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {pieData.map(e => (
                    <div key={e.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                      {e.name} ({e.value})
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar top émotions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart2 size={17} className="text-green-600" /> Top émotions ressenties
                </h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip formatter={(val: number) => [`${val} fois`, 'Occurrences']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}