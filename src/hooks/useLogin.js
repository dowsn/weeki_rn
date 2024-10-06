import { useState } from 'react';
import fetchFromApi from '../utilities/api';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFromApi('login/', {
        method: 'POST',
        body: { username, password },
      });

      console.log('Login response:', response);

      // You might want to do something with the response here,
      // like storing a token in localStorage or updating a global state

      setIsLoading(false);
      return response.content;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { login, isLoading, error };
};
