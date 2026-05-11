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
  token: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  pseudo: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
}

interface AuthResponse {
  token: string;
  expiration: string;
  pseudo: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'cesizen_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
  () => !!localStorage.getItem(TOKEN_KEY)
);

  useEffect(() => {
    if (!token) {
      setCurrentUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiClient.get<AuthUser>('/utilisateur/me')
      .then(setCurrentUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setCurrentUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = async (email: string, motDePasse: string) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      motDePasse,
    });

    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);

    const user = await apiClient.get<AuthUser>('/utilisateur/me');
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  };

  const register = async (data: RegisterData) => {
    await apiClient.post('/auth/register', data);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
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