import { useState } from 'react';
import { fetchFromApi } from '../utilities/api';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    if (!username || !password) {
      setIsLoading(false);
      setError('Username and password are required');
      return { error: true, message: 'Username and password are required' };
    }

    try {
      const response = await fetchFromApi('login/', {
        method: 'POST',
        body: { username, password },
      });
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      if (
        err.message === 'Request timed out' ||
        err.message === 'Network request failed'
      ) {
        setError(
          'Unable to connect to the server. Please check your internet connection and try again.',
        );
      } else {
        setError(err.data?.message || 'An unexpected error occurred');
      }
      return { error: true, message: error };
    }
  };

  return { login, isLoading, error, setError };
};
