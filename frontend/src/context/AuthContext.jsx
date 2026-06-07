import React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, api } from '../services/api';

const AuthContext = createContext(null);

const effectiveRole = (user) => {
  if (!user) return 'student';
  const role = (user.role || '').toLowerCase();
  if (role === 'admin') return 'admin';
  if (user.is_staff || user.is_superuser) return 'admin';
  return role || 'student';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() =>
    !!(localStorage.getItem('access_token') || localStorage.getItem('token'))
  );

  // Load profile on mount if a token exists
  useEffect(() => {
    const access =
      localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!access) {
      setLoading(false);
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    authAPI
      .getProfile()
      .then((profile) => {
        const normalized = { ...profile, role: effectiveRole(profile) };
        setUser(normalized);
        localStorage.setItem('elevate_user_role', normalized.role);
      })
      .catch(() => {
        // Token invalid — try stored role fallback
        const storedRole = localStorage.getItem('elevate_user_role');
        if (storedRole) {
          setUser({ role: storedRole });
          setLoading(false);
          return;
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        localStorage.removeItem('elevate_user_role');
        delete api.defaults.headers.common['Authorization'];
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authAPI.login(credentials);
    const { access, refresh, user: userData, token, ...rest } = res;
    // Some backends return `token` instead of `access` — support both
    const accessToken = access || token;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    if (refresh) localStorage.setItem('refresh_token', refresh);
    const finalUser = userData || rest.user || rest;
    if (finalUser && finalUser.id) {
      const normalized = { ...finalUser, role: effectiveRole(finalUser) };
      setUser(normalized);
      localStorage.setItem('elevate_user_role', normalized.role);
      return normalized;
    }
    return finalUser;
  }, []);

  const registerUser = useCallback(async (userData) => {
    const res = await authAPI.register(userData);
    const { access, refresh, user: registeredUser, token, ...rest } = res;
    const accessToken = access || token;
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    if (refresh) localStorage.setItem('refresh_token', refresh);
    const finalUser = registeredUser || rest.user || rest;
    if (finalUser && finalUser.id) {
      const normalized = { ...finalUser, role: effectiveRole(finalUser) };
      setUser(normalized);
      localStorage.setItem('elevate_user_role', normalized.role);
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      authAPI.logout(refresh).catch(() => {});
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    localStorage.removeItem('elevate_user_role');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register: registerUser, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
