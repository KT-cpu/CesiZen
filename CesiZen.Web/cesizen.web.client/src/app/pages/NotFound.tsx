import React from 'react';
import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-green-100 mb-4">404</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm">
            <ArrowLeft size={16} /> Retour
          </button>
          <Link to="/" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium">
            <Home size={16} /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
