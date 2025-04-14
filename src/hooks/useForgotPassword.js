import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useForgotPassword = () => {
  const { setUser } = useUserContext();
  const { apiCalls, isLoading, error } = useApiCall({
    resetPassword: {
      path: 'reset_password',
      method: 'POST',
      authenticationRequired: false,
    },
  });

  const resetPassword = async (email) => {
    try {
      const response = await apiCalls.resetPassword({ email });

      if (response.content) {
        return response;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      // Preserve and throw the original error message
      throw error;
    }
  };

  return { resetPassword, isLoading, error };
};
