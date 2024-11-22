import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecurityService {
  // Constants for storage keys
  static KEYS = {
    AUTH_TOKENS: 'auth_tokens_secure',
    USER_DATA: 'user_data_secure',
    THEME: 'theme_preference_secure',
  };

  async secureStore(key, value) {
    try {
      const storageKey = this.sanitizeKey(key);
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(storageKey, stringValue);
      } else {
        await SecureStore.setItemAsync(storageKey, stringValue);
      }
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  }

  async secureRetrieve(key) {
    try {
      const storageKey = this.sanitizeKey(key);
      let value;

      if (Platform.OS === 'web') {
        value = await AsyncStorage.getItem(storageKey);
      } else {
        value = await SecureStore.getItemAsync(storageKey);
      }

      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  }

  async secureRemove(key) {
    try {
      const storageKey = this.sanitizeKey(key);
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(storageKey);
      } else {
        await SecureStore.deleteItemAsync(storageKey);
      }
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  }

  // Token management
  async setTokens(tokens) {
    if (!tokens) return;
    await this.secureStore(SecurityService.KEYS.AUTH_TOKENS, tokens);
  }

  async getTokens() {
    return await this.secureRetrieve(SecurityService.KEYS.AUTH_TOKENS);
  }

  async removeTokens() {
    await this.secureRemove(SecurityService.KEYS.AUTH_TOKENS);
  }

  // User data management
  async setUserData(userData) {
    if (!userData) return;
    const userDataWithoutTokens = {
      ...userData,
      tokens: undefined,
    };
    await this.secureStore(
      SecurityService.KEYS.USER_DATA,
      userDataWithoutTokens,
    );
  }

  async getUserData() {
    return await this.secureRetrieve(SecurityService.KEYS.USER_DATA);
  }

  // Helper method to sanitize storage keys
  sanitizeKey(key) {
    return key.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Clear all stored data
  async clearAll() {
    await Promise.all([
      this.removeTokens(),
      this.secureRemove(SecurityService.KEYS.USER_DATA),
      this.secureRemove(SecurityService.KEYS.THEME),
    ]);
  }
}

export default new SecurityService();
