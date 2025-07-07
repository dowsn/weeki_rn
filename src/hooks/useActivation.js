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
      const response = await apiCalls.activate({ first_user_id: userId, activationCode });
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
      console.log('🔍 ACTIVATION HOOK: sendEmail called with userId:', userId);
      console.log('🔍 ACTIVATION HOOK: userId type:', typeof userId);
      console.log('🔍 ACTIVATION HOOK: userId is undefined?', userId === undefined);
      console.log('🔍 ACTIVATION HOOK: About to call apiCalls.sendEMail with params:', { first_user_id: userId });
      
      const response = await apiCalls.sendEMail({ first_user_id: userId });
      
      console.log('🔍 ACTIVATION HOOK: sendEmail API response:', response);

      if (response.content) {
        console.log('✅ ACTIVATION HOOK: sendEmail success, returning response');
        return response;
      }

      console.log('❌ ACTIVATION HOOK: sendEmail no content in response');
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('❌ ACTIVATION HOOK: sendEmail error:', error);
      // Preserve and throw the original error message
      throw error;
    }
  };

  return { activate, sendEmail, isLoading, error };
};
