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
      // Get public data from AsyncStorage
      const publicData = await AsyncStorage.getItem('user_public_data');
      const publicUserData = publicData ? JSON.parse(publicData) : {};

      // Get sensitive data from secure storage
      const sensitiveData = await SecureStore.getItemAsync(
        'user_sensitive_data',
      );
      const sensitiveUserData = sensitiveData ? JSON.parse(sensitiveData) : {};

      // Merge the data
      return { ...publicUserData, ...sensitiveUserData };
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  static async setUserData(userData) {
    // Remove any sensitive fields before storage in AsyncStorage
    const { email, ...publicUserData } = userData;

    // Store public data in AsyncStorage for quick access
    await AsyncStorage.setItem(
      'user_public_data',
      JSON.stringify(publicUserData),
    );

    // Store sensitive data in secure storage
    if (email ) {
      const sensitiveData = { email };
      await SecureStore.setItemAsync(
        'user_sensitive_data',
        JSON.stringify(sensitiveData),
      );
    }

    return true;
  }

  // static async setUserData(userData) {
  //   try {
  //     console.log('Setting user data:', userData);
  //     await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  //     return true;
  //   } catch (error) {
  //     console.error('Error setting user data:', error);
  //     return false;
  //   }
  // }

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
      // Clear AsyncStorage data
      await AsyncStorage.multiRemove(['user_public_data', '@theme:isDark']);

      // Clear secure storage
      await Promise.all([
        SecureStore.deleteItemAsync('access_token'),
        SecureStore.deleteItemAsync('refresh_token'),
        SecureStore.deleteItemAsync('user_sensitive_data'),
      ]);

      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      return false;
``    }
  }
}
