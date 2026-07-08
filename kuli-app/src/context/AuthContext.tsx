import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

interface User {
  id: string;
  phone: string;
  role: 'CUSTOMER' | 'WORKER';
}

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  signIn: (phone: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const userData = await SecureStore.getItemAsync('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Failed to load auth state', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendOTP(phone: string) {
    await api.post('/auth/send-otp', { phone });
  }

  async function signIn(phone: string, otp: string) {
    const response = await api.post('/auth/verify-otp', {
      phone,
      otp,
      deviceId: 'mobile-device-123',
      platform: 'android'
    });

    const { accessToken, user: userData } = response.data;
    
    await SecureStore.setItemAsync('access_token', accessToken);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    
    setUser(userData);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
