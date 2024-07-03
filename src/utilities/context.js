import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(defaultValue);

  // Load any saved state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(key);
        if (savedState !== null) {
          setState(JSON.parse(savedState));
        }
      } catch (error) {
        // Handle errors here
      }
    };

    loadState();
  }, [key]);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        // Handle errors here
      }
    };

    saveState();
  }, [key, state]);

  return [state, setState];
};
