import { useApiCall } from 'src/utils/hook';

export const useLogin = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    login: { path: 'login', method: 'POST' },
    forgotPassword: { path: 'forgot-password', method: 'POST' },
  });

  const login = (username, password) => apiCalls.login({ username, password });

  const forgotPassword = (email) => apiCalls.forgotPassword({ email });

  return { forgotPassword, login, isLoading, error };
};
