import { useState } from 'react';
import { fetchFromApi } from './api';

export const useApiCall = (apiConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (errorMessage) => {
    setIsLoading(false);
    setError(errorMessage);
    return { error: true, message: errorMessage };
  };

  const createApiCall =
    (path, method) =>
    async (params = {}) => {
      setIsLoading(true);
      setError(null);

      for (const [key, value] of Object.entries(params)) {
        if (!value) {
          return handleError(`${key} is required`);
        }
      }

      try {
        const response = await fetchFromApi(path, {
          method,
          body: params,
        });

        setIsLoading(false);

        if (response.error) {
          return handleError(response.message);
        }

        return { error: false, content: response.content };
      } catch (err) {
        const errorMessage =
          err.message === 'Request timed out' ||
          err.message === 'Network request failed'
            ? 'Unable to connect to the server. Please check your internet connection and try again.'
            : err.data?.message || 'An unexpected error occurred';
        return handleError(errorMessage);
      }
    };

  const apiCalls = {};

  for (const [key, config] of Object.entries(apiConfig)) {
    apiCalls[key] = createApiCall(config.path, config.method);
  }

  return { apiCalls, isLoading, error };
};
