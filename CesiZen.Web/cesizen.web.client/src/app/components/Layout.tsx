import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Logo } from './Logo';
import { Link } from 'react-router';
import { Heart, Mail, Phone } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-green-900 text-green-100 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="sm" />
              <p className="mt-3 text-green-300 text-sm leading-relaxed">
                CesiZen est votre compagnon de bien-être mental. Découvrez des ressources, des outils et un tracker pour prendre soin de votre santé mentale au quotidien.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm text-green-300">
                <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link to="/informations" className="hover:text-white transition-colors">Informations</Link></li>
                <li><Link to="/tracker" className="hover:text-white transition-colors">Tracker d'émotions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Urgences & Aide</h3>
              <ul className="space-y-2 text-sm text-green-300">
                <li className="flex items-center gap-2"><Phone size={13} /> 3114 – Numéro national prévention suicide</li>
                <li className="flex items-center gap-2"><Phone size={13} /> 15 – SAMU (urgences médicales)</li>
                <li className="flex items-center gap-2"><Mail size={13} /> contact@cesizen.fr</li>
              </ul>
            </div>
          </div>
          <hr className="border-green-800 my-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-green-400">
            <p className="flex items-center gap-1">
              Fait avec <Heart size={13} className="text-amber-400" /> pour votre bien-être mental
            </p>
            <p>© {new Date().getFullYear()} CesiZen – Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
