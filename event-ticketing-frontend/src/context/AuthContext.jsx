import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user on app load
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get('/api/v1/auth/me'); // Your backend endpoint to get current user
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
      
    }
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/v1/auth/login', { email, password });
      setUser(res.data.user);
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/v1/auth/logout'); // backend endpoint to clear cookie/token
      setUser(null);
      toast.info('Logged out');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/v1/auth/register', formData);
      toast.success('Registered successfully. Please login.');
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
