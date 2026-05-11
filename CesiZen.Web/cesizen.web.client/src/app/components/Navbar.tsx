import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Activity, BookOpen, ChevronDown, LayoutDashboard, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, logout, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navLinks = [
    { to: '/', label: 'Accueil', icon: null },
    { to: '/informations', label: 'Informations', icon: BookOpen },
    ...(isAuthenticated ? [{ to: '/tracker', label: 'Mon Tracker', icon: Activity }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Administration', icon: Settings }] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size="sm" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                  (link.to === '/' ? location.pathname === '/' : isActive(link.to))
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.icon && <link.icon size={15} />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(previous => !previous)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentUser?.initials || 'U'}
                  </div>
                  <span className="max-w-[140px] truncate">{currentUser?.displayName}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to="/profil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Mon profil
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={15} /> Administration
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut size={15} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/connexion" className="px-4 py-2 text-sm text-green-700 hover:text-green-800 font-medium transition-colors">
                  Connexion
                </Link>
                <Link to="/inscription" className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(previous => !previous)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                (link.to === '/' ? location.pathname === '/' : isActive(link.to))
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon && <link.icon size={16} />}
              {link.label}
            </Link>
          ))}
          <hr className="border-gray-100 my-2" />
          {isAuthenticated ? (
            <>
              <Link to="/profil" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <User size={16} /> Mon profil
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link to="/connexion" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-center text-sm text-green-700 border border-green-200 rounded-lg hover:bg-green-50">
                Connexion
              </Link>
              <Link to="/inscription" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-center text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      )}

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}
    </nav>
  );
}
