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
import SecurityService from './SecurityService';

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

  useEffect(() => {
    const initializeState = async () => {
      try {
        const [userData, storedTheme, tokens] = await Promise.all([
          SecurityService.getUserData(),
          SecurityService.secureRetrieve('@isDark'),
          SecurityService.getTokens(),
        ]);

        if (userData) {
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
        await SecurityService.setTokens(userData.tokens);
      }
      await SecurityService.setUserData(userData);
      setUser(userData);
    } catch (error) {
      console.error('Error storing user data:', error);
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
        SecurityService.setUserData({ userId: 0 }),
        SecurityService.removeTokens(),
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
      await SecurityService.secureStore('@isDark', JSON.stringify(newTheme));
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
