import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Load current user profile from /api/auth/me on mount or token change
  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setUser(null);
        setProfile(null);
        setAvailability(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          setProfile(res.data.profile);
          setAvailability(res.data.availability);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error('Failed to restore session', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setProfile(null);
        setAvailability(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();

    const handleLogoutEvent = () => {
      setUser(null);
      setProfile(null);
      setAvailability(null);
      setToken('');
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
    setAvailability(null);
    setToken('');
  };

  // 1-Click Demo Login
  const quickDemoLogin = async (role) => {
    let email = 'sarah.jenkins@example.com';
    let password = 'password123';

    if (role === 'ngo') {
      email = 'greenearth@ngo.org';
      password = 'password123';
    } else if (role === 'admin') {
      email = 'admin@volunteerhub.org';
      password = 'adminpassword123';
    }

    return await login(email, password);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        setAvailability(res.data.availability);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const updateProfileState = (newProfile) => {
    setProfile(newProfile);
  };

  const updateAvailabilityState = (newAvailability) => {
    setAvailability(newAvailability);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        availability,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
        updateProfileState,
        updateAvailabilityState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
