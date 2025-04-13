import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export default class SecurityService {
  static async getTokens() {
    try {
      // Using Expo SecureStore
      const [access, refresh] = await Promise.all([
        SecureStore.getItemAsync('access_token'),
        SecureStore.getItemAsync('refresh_token'),
      ]);
      if (!access && !refresh) {
        return null;
      }

      return { access, refresh };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  // static async getTokens() {
  //   try {
  //     const [access, refresh] = await Promise.all([
  //       AsyncStorage.getItem('access_token'),
  //       AsyncStorage.getItem('refresh_token'),
  //     ]);

  //     if (!access && !refresh) {
  //       return null;
  //     }

  //     return { access, refresh };
  //   } catch (error) {
  //     console.error('Error getting tokens:', error);
  //     return null;
  //   }
  // }

  static async setTokens({ access, refresh }) {
    try {
      // Using Expo SecureStore
      const promises = [];
      if (access) {
        promises.push(SecureStore.setItemAsync('access_token', access));
      }
      if (refresh) {
        promises.push(SecureStore.setItemAsync('refresh_token', refresh));
      }

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error setting tokens:', error);
      return false;
    }
  }

  // static async setTokens({ access, refresh }) {
  //   try {
  //     const promises = [];

  //     if (access) {
  //       promises.push(AsyncStorage.setItem('access_token', access));
  //     }

  //     if (refresh) {
  //       promises.push(AsyncStorage.setItem('refresh_token', refresh));
  //     }

  //     await Promise.all(promises);
  //     return true;
  //   } catch (error) {
  //     console.error('Error setting tokens:', error);
  //     return false;
  //   }
  // }

  static async removeTokens() {
    try {
      // Using Expo SecureStore
      await Promise.all([
        SecureStore.deleteItemAsync('access_token'),
        SecureStore.deleteItemAsync('refresh_token'),
      ]);


    } catch (error) {
      console.error('Error removing tokens:', error);
    }
  }

  // Add these new methods for user data management
  static async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async setUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error setting user data:', error);
      return false;
    }
  }

  // Method for theme storage
  static async secureStore(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  }

  static async secureRetrieve(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  }

  static async clearAll() {
    try {
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_data',
        '@isDark',
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}
