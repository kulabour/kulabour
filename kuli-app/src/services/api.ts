import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_URL = 'http://192.168.1.100:3000'; // Replace with local machine IP for testing on physical device

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Ignore SecureStore errors during hydration
  }
  return config;
});
