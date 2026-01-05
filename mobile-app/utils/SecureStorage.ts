import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const SecureStorage = {
    async setItem(key: string, value: string) {
        if (Platform.OS === 'web') {
            return AsyncStorage.setItem(key, value);
        }
        return SecureStore.setItemAsync(key, value);
    },

    async getItem(key: string) {
        if (Platform.OS === 'web') {
            return AsyncStorage.getItem(key);
        }
        return SecureStore.getItemAsync(key);
    },

    async removeItem(key: string) {
        if (Platform.OS === 'web') {
            return AsyncStorage.removeItem(key);
        }
        return SecureStore.deleteItemAsync(key);
    },
};
