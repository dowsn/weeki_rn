import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useActivation = () => {
  const { setUser } = useUserContext();

  const { apiCalls, isLoading, error } = useApiCall({
    activate: {
      path: 'activate_profile',
      method: 'POST',
      authenticationRequired: false,
    },
    sendEMail: {
      path: 'send_activation_code',
      method: 'POST',
      authenticationRequired: false,
    },
  });

  const activate = async (userId, activationCode) => {
    try {
      const response = await apiCalls.activate({ userId, activationCode });
      if (response.content) {
        if (response.content.activated == true) {
          await setUser(response.content);
        }

        return response;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      // Preserve and throw the original error message
      throw error;
    }
  };

  const sendEmail = async (userId) => {
    try {
      const response = await apiCalls.sendEMail({ userId });

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

  return { activate, sendEmail, isLoading, error };
};
