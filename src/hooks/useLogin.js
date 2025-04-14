import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useLogin = () => {
  const { setUser } = useUserContext();
  const { apiCalls, isLoading, error } = useApiCall({
    login: { path: 'login', method: 'POST', authenticationRequired: false },
  });

  const login = async (username, password) => {
    try {
      const response = await apiCalls.login({ username, password });

      if (response.content) {
        if (response.content.activated == true) {
            await setUser(response.content);
        }

        return response;
      }


      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // console.error('Weeki:', "Oops, I can't log you in, please try again.");
      // Preserve and throw the original error message
      throw error;
    }
  };

  return { login, isLoading, error };
};