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
import { usePersistedState } from '../utils/context';

export const UserContext = createContext();

const storeData = async (key, value, setLoading) => {
  try {
    setLoading(true);
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  } finally {
    setLoading(false);
  }
};

export const UserProvider = ({ children, initialUser }) => {

  const defaultUser = {
    userId: 0,
  };

  const [user, setUser] = usePersistedState('user', defaultUser);
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = usePersistedState(
    'isDark',
    colorScheme === 'dark',
  );
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    storeData('@isDark', !isDark, setLoading);
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
    setUser,
    theme,
    loading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};