import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useLogin = () => {
  const { setUser } = useUserContext();

  const { apiCalls, isLoading, error } = useApiCall({
    login: { path: 'login', method: 'POST' },
  });

  const login = async (username, password) => {
    try {
      const response = await apiCalls.login({ username, password });

      if (response.content) {
        await setUser(response.content);
        return response;
      }
      throw new Error('Invalid login response');
    } catch (error) {
      throw error;
    }
  };

  return { login, isLoading, error };
};