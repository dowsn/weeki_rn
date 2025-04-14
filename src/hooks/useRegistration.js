import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useRegistration = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    register: { path: 'register', method: 'POST', authenticationRequired: false },
  });

  const register = async (username, password, email, reminder) => {
    try {
      const response = await apiCalls.register({
        username,
        password,
        email,
        reminder
      });

      if (response.content) {
        return response
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      // Preserve and throw the original error message
      throw error;
    }
  };

  return { register, isLoading, error };
};
