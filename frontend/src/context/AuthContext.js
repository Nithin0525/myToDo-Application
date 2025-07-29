import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (token && username) {
      setUser({ token, username });
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setTheme(savedTheme);
    setLoading(false);
  }, []);

  // Update theme in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        email,
        password
      });

      const { token, username } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ token, username });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/register', {
        username,
        email,
        password
      });

      const { token, username: registeredUsername } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', registeredUsername);
      
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ token, username: registeredUsername });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Remove axios default headers
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('http://localhost:5001/api/profile', profileData);
      
      // Update username in localStorage if it changed
      if (response.data.username && response.data.username !== user.username) {
        localStorage.setItem('username', response.data.username);
        setUser(prev => ({ ...prev, username: response.data.username }));
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile');
      return { success: true, profile: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to get profile' 
      };
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    user,
    loading,
    theme,
    login,
    register,
    logout,
    updateProfile,
    getProfile,
    toggleTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 