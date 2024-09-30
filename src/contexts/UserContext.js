import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import {
  borderRadii,
  darkColors,
  fontSizes,
  lightColors,
  spacing,
} from '../constants/theme';
import { usePersistedState } from '../utilities/context';

export const UserContext = createContext();

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const UserProvider = ({ children }) => {
  const defaultUser = {
    userId: '0',
    selectedCityId: 1,
    selectedCityShortName: 'VE',
    selectedPickListIndex: 0,
    lat: null,
    long: null,
  };

  const [user, setUser] = usePersistedState('user', defaultUser);
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = usePersistedState(
    'isDark',
    colorScheme === 'dark',
  );

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    storeData('@isDark', !isDark);
  };

  const theme = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    spacing,
    fontSizes,
    borderRadii,
    toggleTheme,
  };

  const contextValue = {
    user,
    setUser,
    theme,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
