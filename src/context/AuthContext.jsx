import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth-context';
import { apiGet, apiPost, clearAccessToken, setAccessToken } from '../lib/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const data = await apiPost('/api/v1/auth/refresh', {});
      setAccessToken(data.accessToken);
      setUser(data.user);
      return true;
    } catch {
      clearAccessToken();
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await apiPost('/api/v1/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiPost('/api/v1/auth/logout', {});
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const fetchMe = async () => {
    const data = await apiGet('/api/v1/auth/me');
    setUser(data.user);
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout, fetchMe, refreshSession }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
