import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          setState(JSON.parse(value));
        }
      } catch (e) {
        console.error(`Error loading persisted state for key "${key}":`, e);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedState();
  }, [key]);

 const setPersistentState = useCallback(
   (newState) => {
     setState(newState);
     if (newState === null || newState === undefined) {
       AsyncStorage.removeItem(key).catch((e) =>
         console.error(`Error removing persisted state for key "${key}":`, e),
       );
     } else {
       AsyncStorage.setItem(key, JSON.stringify(newState)).catch((e) =>
         console.error(`Error saving persisted state for key "${key}":`, e),
       );
     }
   },
   [key],
 );

  return [state, setPersistentState, isLoading];
};
