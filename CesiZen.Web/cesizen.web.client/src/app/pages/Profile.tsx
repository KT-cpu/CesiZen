import React, { useState } from 'react';
import { User, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

export function Profile() {
  const { currentUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    pseudo: currentUser?.pseudo || '',
    email: currentUser?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [pwdForm, setPwdForm] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    setProfileLoading(true);
    try {
      await apiClient.put('/utilisateur/me', {
        pseudo: profileForm.pseudo,
        email: profileForm.email,
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message ?? 'Erreur lors de la mise à jour du profil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    if (pwdForm.nouveauMotDePasse !== pwdForm.confirmationMotDePasse) {
      setPwdError('Les mots de passe ne correspondent pas.');
      return;
    }

    setPwdLoading(true);
    try {
      await apiClient.put('/utilisateur/me/mot-de-passe', pwdForm);
      setPwdSuccess(true);
      setPwdForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmationMotDePasse: '' });
      setTimeout(() => setPwdSuccess(false), 3000);
    } catch (err: any) {
      setPwdError(err.message ?? 'Erreur lors du changement de mot de passe.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {/* Informations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {currentUser.pseudo?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <User size={17} /> Informations personnelles
            </h2>
            <p className="text-sm text-gray-500">
              Membre depuis le {new Date(currentUser.dateCreation).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 size={16} /> Profil mis à jour avec succès.
          </div>
        )}
        {profileError && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} /> {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pseudo</label>
            <input type="text" value={profileForm.pseudo}
              onChange={e => setProfileForm(p => ({ ...p, pseudo: e.target.value }))}
              minLength={3} maxLength={50}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
            <input type="email" value={profileForm.email}
              onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rôle</label>
            <div className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500">
              {currentUser.role === 'Administrateur' ? 'Administrateur' : 'Utilisateur'}
            </div>
          </div>
          <button type="submit" disabled={profileLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-60">
            {profileLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>

      {/* Mot de passe */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
          <Lock size={17} /> Changer le mot de passe
        </h2>

        {pwdSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 size={16} /> Mot de passe modifié avec succès.
          </div>
        )}
        {pwdError && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={16} /> {pwdError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label: 'Mot de passe actuel', key: 'ancienMotDePasse' },
            { label: 'Nouveau mot de passe', key: 'nouveauMotDePasse' },
            { label: 'Confirmer le nouveau mot de passe', key: 'confirmationMotDePasse' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'}
                  value={pwdForm[field.key as keyof typeof pwdForm]}
                  onChange={e => setPwdForm(p => ({ ...p, [field.key]: e.target.value }))}
                  required placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-10" />
                {field.key === 'ancienMotDePasse' && (
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={pwdLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-60">
            {pwdLoading ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}
