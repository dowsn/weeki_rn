import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  borderRadii,
  darkColors,
  fontSizes,
  lightColors,
  line,
  spacing,
} from '../constants/theme';

export const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
  const defaultUser = {
    userId: 0,
    tokens: {
      access: null,
      refresh: null,
    },
  };

  const [user, setUser] = useState(initialUser || defaultUser);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Storage helper functions
  const storage = {
    async setTokens(tokens) {
      try {
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
      } catch (error) {
        console.error('Error storing tokens:', error);
      }
    },

    async getTokens() {
      try {
        const tokens = await AsyncStorage.getItem('auth_tokens');
        return tokens ? JSON.parse(tokens) : null;
      } catch (error) {
        console.error('Error retrieving tokens:', error);
        return null;
      }
    },

    async removeTokens() {
      try {
        await AsyncStorage.removeItem('auth_tokens');
      } catch (error) {
        console.error('Error removing tokens:', error);
      }
    },
  };

  useEffect(() => {
    const initializeState = async () => {
      try {
        const [storedUser, storedTheme, tokens] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('@isDark'),
          storage.getTokens(),
        ]);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            ...userData,
            tokens,
          });
        }
        if (storedTheme !== null) {
          setIsDark(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error('Error initializing state:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeState();
  }, []);

  const setUserAndTokens = async (userData) => {
    try {
      if (userData.tokens) {
        await storage.setTokens(userData.tokens);
      }

      // Store user data without tokens
      const userDataWithoutTokens = {
        ...userData,
        tokens: undefined,
      };
      await AsyncStorage.setItem('user', JSON.stringify(userDataWithoutTokens));

      // Update state
      setUser(userData);
    } catch (error) {
      console.error('Error storing user data:', error);
      // Still update the state even if storage fails
      setUser(userData);
    }
  };

  const logout = async () => {
    const defaultUserData = {
      userId: 0,
      tokens: {
        access: null,
        refresh: null,
      },
    };
    try {
      await Promise.all([
        AsyncStorage.setItem('user', JSON.stringify({ userId: 0 })),
        storage.removeTokens(),
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(defaultUserData);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('@isDark', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error storing theme:', error);
    }
  };

  const theme = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    fontSizes,
    borderRadii,
    line,
    toggleTheme,
  };

  const contextValue = {
    user,
    setUser: setUserAndTokens,
    logout,
    theme,
    loading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
