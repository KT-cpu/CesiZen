import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Brain, Heart, Activity, BookOpen, Shield, Users, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import type { Information } from '../context/AppDataContext';
import { ImageWithFallback } from '../components/ImageWithFallback';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1767611070476-09d0db4374a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200';

export function Home() {
  const { isAuthenticated } = useAuth();
  const { getInformations } = useAppData();
  const [recentInfos, setRecentInfos] = useState<Information[]>([]);

  useEffect(() => {
    getInformations()
      .then(infos => setRecentInfos(infos.slice(0, 3)))
      .catch(() => setRecentInfos([]));
  }, []);

  const features = [
    {
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      title: 'Informations & Ressources',
      desc: 'Accédez à des articles et guides sur la santé mentale, le stress et le bien-être.',
    },
    {
      icon: Activity,
      color: 'bg-amber-50 text-amber-600',
      title: "Tracker d'émotions",
      desc: 'Suivez vos émotions au quotidien et visualisez votre évolution grâce à des rapports détaillés.',
    },
    {
      icon: Heart,
      color: 'bg-green-50 text-green-600',
      title: 'Activités de détente',
      desc: 'Découvrez des exercices de respiration, méditations guidées et pratiques de pleine conscience.',
    },
    {
      icon: Shield,
      color: 'bg-purple-50 text-purple-600',
      title: 'Espace sécurisé',
      desc: 'Votre espace personnel sécurisé pour suivre votre parcours en toute confidentialité.',
    },
  ];

  const testimonials = [
    { name: 'Sophie L.', text: "CesiZen m'a aidé à mieux comprendre mes émotions et à gérer mon anxiété au quotidien.", stars: 5 },
    { name: 'Marc D.', text: "Le tracker d'émotions est un outil formidable. Je recommande à tous ceux qui souhaitent mieux se connaître.", stars: 5 },
    { name: 'Amira K.', text: 'Les articles sont très bien écrits et les techniques de respiration ont vraiment changé ma façon de gérer le stress.', stars: 5 },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback src={HERO_IMAGE} alt="Bien-être mental" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm">
              <Brain size={15} className="text-amber-300" />
              <span>Votre application de santé mentale</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Prenez soin de votre{' '}
              <span className="text-amber-400">santé mentale</span>{' '}
              au quotidien
            </h1>
            <p className="text-lg sm:text-xl text-green-100 mb-8 leading-relaxed">
              CesiZen vous accompagne pour comprendre vos émotions, gérer votre stress et accéder à des ressources expertes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/tracker" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-medium">
                    <Activity size={18} /> Mon tracker d'émotions <ArrowRight size={16} />
                  </Link>
                  <Link to="/informations" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white px-6 py-3 rounded-xl hover:bg-white/25 transition-colors font-medium border border-white/30">
                    <BookOpen size={18} /> Explorer les ressources
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/inscription" className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-medium">
                    Commencer gratuitement <ArrowRight size={16} />
                  </Link>
                  <Link to="/informations" className="inline-flex items-center justify-center gap-2 bg-white/15 text-white px-6 py-3 rounded-xl hover:bg-white/25 transition-colors font-medium border border-white/30">
                    <BookOpen size={18} /> Explorer les ressources
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="rgb(249 250 251)" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '1 personne sur 4', label: 'sera touchée par un trouble mental au cours de sa vie' },
            { value: '60%', label: "des personnes ne consultent pas de professionnel par manque d'information" },
            { value: '20 min', label: 'de pleine conscience par jour réduisent le stress de 30%' },
            { value: '8h', label: 'de sommeil recommandées pour une santé mentale optimale' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }} className="text-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-2xl font-black text-green-700 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-500 max-w-xl mx-auto">CesiZen réunit en un seul endroit tous les outils pour prendre soin de votre santé mentale.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations récentes */}
      {recentInfos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Articles récents</h2>
              <p className="text-gray-500 mt-1">Ressources et conseils pour votre bien-être</p>
            </div>
            <Link to="/informations" className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm">
              Voir tout <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentInfos.map((info, i) => (
              <motion.div key={info.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Link to={`/informations/${info.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5">
                  <span className="inline-block text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full mb-2">{info.type}</span>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2">{info.titre}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3">{info.contenu.substring(0, 120)}…</p>
                  <div className="flex items-center gap-1 mt-3 text-green-600 text-sm font-medium">
                    Lire l'article <ArrowRight size={13} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-700 to-green-600 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <Users size={40} className="mx-auto mb-4 text-amber-300" />
          <h2 className="text-3xl font-black mb-3">Rejoignez la communauté CesiZen</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">Créez votre compte gratuit et commencez à prendre soin de votre santé mentale dès aujourd'hui.</p>
          {!isAuthenticated && (
            <Link to="/inscription" className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors font-medium">
              Créer mon compte gratuitement <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Ce qu'ils en disent</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <p className="font-medium text-gray-900 text-sm">{t.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
