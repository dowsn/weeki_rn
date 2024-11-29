import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SecurityService {
  // Constants for storage keys - ensure they are valid for SecureStore
  static KEYS = {
    AUTH_TOKENS: 'auth_tokens',
    USER_DATA: 'user_data',
  };

  // Helper method to sanitize keys
  sanitizeKey(key) {
    // Remove any invalid characters and replace spaces with underscores
    return key.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  async secureStore(key, value) {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (Platform.OS === 'web') {
        const encodedValue = btoa(stringValue);
        await AsyncStorage.setItem(sanitizedKey, encodedValue);
      } else {
        await SecureStore.setItemAsync(sanitizedKey, stringValue);
      }
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }

  async secureRetrieve(key) {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      let value;

      if (Platform.OS === 'web') {
        const encodedValue = await AsyncStorage.getItem(sanitizedKey);
        if (!encodedValue) return null;
        value = atob(encodedValue);
      } else {
        value = await SecureStore.getItemAsync(sanitizedKey);
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
      const sanitizedKey = this.sanitizeKey(key);
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(sanitizedKey);
      } else {
        await SecureStore.deleteItemAsync(sanitizedKey);
      }
    } catch (error) {
      console.error('Error removing secure data:', error);
      throw error;
    }
  }

  // Token management
  async setTokens(tokens) {
    if (!tokens) return;
    const tokenData = {
      ...tokens,
      timestamp: Date.now(),
    };
    await this.secureStore(SecurityService.KEYS.AUTH_TOKENS, tokenData);
  }

  async getTokens() {
    const tokenData = await this.secureRetrieve(
      SecurityService.KEYS.AUTH_TOKENS,
    );
    if (!tokenData) return null;

    // Check if tokens are expired (15 minutes)
    const isExpired = Date.now() - tokenData.timestamp > 15 * 60 * 1000;
    if (isExpired) {
      await this.removeTokens();
      return null;
    }

    return {
      access: tokenData.access,
      refresh: tokenData.refresh,
    };
  }

  async removeTokens() {
    await this.secureRemove(SecurityService.KEYS.AUTH_TOKENS);
  }

  // User data management
  async setUserData(userData) {
    if (!userData) return;
    const sanitizedData = {
      ...userData,
      tokens: undefined, // Never store tokens with user data
    };
    await this.secureStore(SecurityService.KEYS.USER_DATA, sanitizedData);
  }

  async getUserData() {
    return await this.secureRetrieve(SecurityService.KEYS.USER_DATA);
  }

  // Clear all stored data
  async clearAll() {
    try {
      await Promise.all([
        this.removeTokens(),
        this.secureRemove(SecurityService.KEYS.USER_DATA),
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export default new SecurityService();
