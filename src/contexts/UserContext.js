import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { usePersistedState } from '../utilities/context';

export const UserContext = createContext();

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (e) {
    // saving error
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Done.');
};



export const UserProvider = ({ children }) => {

  // delete this line
  // clearAll();

  const defaultUser = {
    userId: '0',
    selectedCityId: 1,
    selectedCityShortName: 'VE',
    selectedPickListIndex: 0,
    lat: null,
    long: null,
  };


  const [user, setUser] = usePersistedState('user', defaultUser);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
