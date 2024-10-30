import { useApiCall } from './useApiCall';

export const useLogin = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    login: { path: 'week', method: 'GET' },
    forgotPassword: { path: 'week_filter', method: 'GET' },
  });

  const login = (username, password) => callApi({ username, password });

  const forgotPassword = (email) => callApi({ email });

  return { forgotPassword, login, isLoading, error };
};
