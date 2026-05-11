import React, {
  createContext, useContext, useState,
  useEffect, ReactNode,
} from 'react';
import { apiClient } from '../services/apiClient';

interface AuthUser {
  id: number;
  pseudo: string;
  email: string;
  role: string;
  estActif: boolean;
  dateCreation: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  pseudo: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<AuthUser>('/utilisateur/me')
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, motDePasse: string) => {
    const response = await apiClient.post<{
      token: string; pseudo: string; role: string;
    }>('/auth/login', { email, motDePasse });

    if (response.role === 'Administrateur') {
    throw new Error(
      "L'espace administrateur est accessible uniquement depuis le site web."
    );
  }

    await apiClient.saveToken(response.token);
    const user = await apiClient.get<AuthUser>('/utilisateur/me');
    setCurrentUser(user);
  };

  const logout = async () => {
    await apiClient.removeToken();
    setCurrentUser(null);
  };

  const register = async (data: RegisterData) => {
    await apiClient.post('/auth/register', data);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      isAdmin: currentUser?.role === 'Administrateur',
      loading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}