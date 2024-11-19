import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

export const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const pendingUpdate = useRef(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null && isMounted.current) {
          setState(JSON.parse(value));
        }
      } catch (e) {
        console.error(`Error loading persisted state for key "${key}":`, e);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    loadPersistedState();
  }, [key]);

  const setPersistentState = useCallback(
    async (newState) => {
      // Cancel any pending updates
      if (pendingUpdate.current) {
        clearTimeout(pendingUpdate.current);
      }

      // Get the actual new state value if it's a function
      const newValue =
        typeof newState === 'function' ? newState(state) : newState;

      if (!isMounted.current) return;
      setState(newValue);

      // Debounce the storage operation
      pendingUpdate.current = setTimeout(async () => {
        try {
          if (newValue === null || newValue === undefined) {
            await AsyncStorage.removeItem(key);
          } else {
            await AsyncStorage.setItem(key, JSON.stringify(newValue));
          }
        } catch (e) {
          console.error(`Error persisting state for key "${key}":`, e);
        } finally {
          pendingUpdate.current = null;
        }
      }, 100); // Debounce for 100ms
    },
    [key, state],
  );

  // Cleanup pending operations on unmount
  useEffect(() => {
    return () => {
      if (pendingUpdate.current) {
        clearTimeout(pendingUpdate.current);
      }
    };
  }, []);

  return [state, setPersistentState, isLoading];
};
