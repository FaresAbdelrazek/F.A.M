// src/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';           // <-- your axios instance
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to set auth token
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // 1. Load current user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthToken(token);
          // Use the correct endpoint that exists in your backend
          const res = await api.get('/users/profile');
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Load user error:', err);
        setUser(null);
        setAuthToken(null); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // 2. Login
  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password }); // Correct endpoint
      const { token } = res.data;
      
      setAuthToken(token);
      
      // Get user profile after login
      const userRes = await api.get('/users/profile');
      setUser(userRes.data.user);
      
      toast.success('Logged in successfully');
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  // 3. Logout
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    toast.info('Logged out');
  };

  // 4. Register
  const register = async (formData) => {
    try {
      console.log('Registering with data:', formData);
      const res = await api.post('/register', formData); // Correct endpoint
      console.log('Registration response:', res.data);
      toast.success('Registered successfully. Please log in.');
      return res.data;
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      toast.error(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};