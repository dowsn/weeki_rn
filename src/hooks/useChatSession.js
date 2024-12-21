import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useChatSession = () => {

  const { apiCalls, isLoading, error } = useApiCall({
    create: { path: 'chat_sessions', method: 'POST' },
    cancel: { path: 'chat_sessions', method: 'DELETE' },
    reschedule: { path: 'chat_sessions', method: 'PUT' },
  });

  const reschedule = async (userId, chatSessionId, date) => {
    try {
      const response = await apiCalls.reschedule({ userId, chatSessionId, date });

      console.log('Chat session rescheduled:', response);

      if (response.error != true) {
        return response.message;
      }

      throw new Error('Invalid login response');
    } catch (error) {
      throw error;
    }
  }

  const cancel = async (chatSessionId) => {
    try {
      console.log('Cancelling chat session:', chatSessionId);
      const response = await apiCalls.cancel({ chatSessionId });

      console.log('Chat session cancelled:', response);

      if (response.error != true) {
        return response.message;
      }

      throw new Error('Invalid login response');
    } catch (error) {
      throw error;
    }
  }

  const create = async (userId, date) => {

    try {
      const response = await apiCalls.create({ userId, date });

      console.log('Chat session created:', response);

      if (response.error != true) {
        return response.message;
      }

      throw new Error('Invalid login response');
    } catch (error) {
      throw error;
    }
  };

  return { create, cancel, reschedule, error };
};
