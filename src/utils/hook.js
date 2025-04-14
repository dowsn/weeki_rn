import { useState } from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import { fetchFromApi } from './api';

export const useApiCall = (apiConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, setUser, logout } = useUserContext();

  const handleError = (errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
    return { error: true, message: errorMessage };
  };

  const createApiCall =
    (path, method, authenticationRequired = true) =>
      async (params = {}) => {

      console.log('API call2:', authenticationRequired);
      setIsLoading(true);
      setError(null);

      // Validate required parameters
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined) {
          console.log('key', key, 'value', value);
          return handleError(`${key} is required`);
        }
      }

      try {
        const response = await fetchFromApi(path, {
          method,
          body: params,
          user,
          setUser,
          // For token refresh handling
        }, authenticationRequired);

        setIsLoading(false);

        if (response.error) {
          return handleError(response.message);
        }

        return {
          error: false,
          content: response.content,
          message: response.message,
        };
      } catch (err) {
        // console.error('API call error2:', err);
        let errorMessage = err.message;

        if (err.message === 'Request timed out') {
          errorMessage =
            'Unable to connect to the server. Please check your internet connection.';
        } else if (err.message === 'Network request failed') {
          errorMessage =
            'Network connection failed. Please check your internet.';
        } else if (err.message === 'Authentication failed') {
          errorMessage = 'Your session has expired. Please log in again.';
          // Let UserContext handle the logout
          if (user?.tokens?.refresh) {
            await logout();
          }
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        }

        return handleError(errorMessage);
      }
    };

  const apiCalls = {};
  for (const [key, config] of Object.entries(apiConfig)) {
    apiCalls[key] = createApiCall(
      config.path,
      config.method,
      config.authenticationRequired !== undefined ? config.authenticationRequired : true,
    );
  }

  return { apiCalls, isLoading, error };
};
