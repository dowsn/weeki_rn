import { useState } from 'react';
import { fetchFromApi } from '../utils/api';

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

      if (response.error) {
        setError(response.message);
        return { error: true, message: response.message };
      }

      return { error: false, content: response.content };
    } catch (err) {
      setIsLoading(false);
      const errorMessage =
        err.message === 'Request timed out' || err.message === 'Network request failed'
          ? 'Unable to connect to the server. Please check your internet connection and try again.'
          : err.data?.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { error: true, message: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
      setIsLoading(true);
      setError(null);

      if (!email) {
        setIsLoading(false);
        setError('Please, provide your email address');
        return { error: true, message: error };
        // will this work
      }

      try {
        const response = await fetchFromApi('forgotPassword/', {
          method: 'POST',
          body: { email },
        });
        // finish backend side

        setIsLoading(false);

        if (response.error) {
          setError(response.message);
          return { error: true, message: response.message };
        }

        return { error: false, content: response.content };
      } catch (err) {
        setIsLoading(false);
        const errorMessage =
          err.message === 'Request timed out' ||
          err.message === 'Network request failed'
            ? 'Unable to connect to the server. Please check your internet connection and try again.'
            : err.data?.message || 'An unexpected error occurred';
        setError(errorMessage);
        return { error: true, message: errorMessage };
      }
  };


  return { forgotPassword, login, isLoading, error };
};
