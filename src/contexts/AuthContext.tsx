import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import mockData from '../data/mockData';
import type { User, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((email: string, password: string) => {
    setLoading(true);
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        const found = mockData.users.find(u => u.email === email && u.password === password);
        if (found) {
          setUser(found);
          resolve(found);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
        setLoading(false);
      }, 800);
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const hasAccess = useCallback((...roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
