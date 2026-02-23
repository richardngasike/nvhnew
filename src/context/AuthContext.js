'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { landlordAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nhv_landlord');
    const token = localStorage.getItem('nhv_token');
    if (stored && token) {
      setLandlord(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const data = await landlordAPI.login({ phone, password });
    localStorage.setItem('nhv_token', data.token);
    localStorage.setItem('nhv_landlord', JSON.stringify(data.landlord));
    setLandlord(data.landlord);
    return data;
  };

  const register = async (formData) => {
    const data = await landlordAPI.register(formData);
    localStorage.setItem('nhv_token', data.token);
    localStorage.setItem('nhv_landlord', JSON.stringify(data.landlord));
    setLandlord(data.landlord);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nhv_token');
    localStorage.removeItem('nhv_landlord');
    setLandlord(null);
  };

  return (
    <AuthContext.Provider value={{ landlord, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
