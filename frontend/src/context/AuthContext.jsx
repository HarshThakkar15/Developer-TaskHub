// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { getToken, saveToken, removeToken } from '../utils/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoadingAuth(false); return; }
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/auth/me');
        if (!mounted) return;
        setUser(res.data);
      } catch (err) {
        removeToken();
        setUser(null);
      } finally {
        if (mounted) setLoadingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveToken(res.data.token);
    const me = await api.get('/auth/me');
    setUser(me.data);
    return me.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    saveToken(res.data.token);
    const me = await api.get('/auth/me');
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}