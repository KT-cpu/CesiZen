import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
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
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    apiClient.get<AuthUser>('/utilisateur/me')
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, motDePasse: string) => {
    await apiClient.post('/auth/login', { email, motDePasse });
    const user = await apiClient.get<AuthUser>('/utilisateur/me');
    setCurrentUser(user);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout', {});
    setCurrentUser(null);
  };

  const register = async (data: RegisterData) => {
    await apiClient.post('/auth/register', data);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin: currentUser?.role === 'Administrateur',
      isAuthenticated: !!currentUser,
      isLoading,
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