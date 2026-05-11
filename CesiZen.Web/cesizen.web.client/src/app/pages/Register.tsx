import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export function Register() {
  const [form, setForm] = useState({
    pseudo: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.motDePasse !== form.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/connexion', { state: { registered: true } });
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.motDePasse.length >= 12 ? 3 : form.motDePasse.length >= 8 ? 2 : form.motDePasse.length >= 4 ? 1 : 0;
  const strengthLabels = ['', 'Faible', 'Moyen', 'Fort'];
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-500'];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size="md" /></div>
            <h1 className="text-2xl font-black text-gray-900">Créer un compte</h1>
            <p className="text-gray-500 text-sm mt-1">Rejoignez CesiZen gratuitement</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Pseudo</label>
              <input type="text" value={form.pseudo} onChange={e => setForm(p => ({ ...p, pseudo: e.target.value }))} required
                placeholder="MonPseudo" minLength={3} maxLength={50}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <p className="text-xs text-gray-400 mt-1">Lettres, chiffres, tirets et underscores uniquement.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required
                placeholder="vous@exemple.fr"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.motDePasse}
                  onChange={e => setForm(p => ({ ...p, motDePasse: e.target.value }))} required placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.motDePasse.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? strengthColors[strength] : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{strengthLabels[strength]} — min. 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={form.confirmationMotDePasse}
                  onChange={e => setForm(p => ({ ...p, confirmationMotDePasse: e.target.value }))} required placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12" />
                {form.confirmationMotDePasse && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${form.motDePasse === form.confirmationMotDePasse ? 'text-green-500' : 'text-red-400'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-60">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <UserPlus size={18} />}
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="text-green-600 hover:text-green-700 font-medium">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
