import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useChatSession = () => {

  const { apiCalls, isLoading, error } = useApiCall({
    create: { path: 'chat_sessions', method: 'POST' },
  });

  const create = async (userId, date) => {
    try {
      const response = await apiCalls.create({ userId, date });

      if (response.error != true) {
        return response.message;
      }

      throw new Error('Invalid login response');
    } catch (error) {
      throw error;
    }
  };

  return { create, error };
};``