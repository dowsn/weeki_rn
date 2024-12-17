import { useApiCall } from 'src/utils/hook';

export const useTopicsAndChatSession = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    getTopicsAndChatSession: { path: 'topics_and_chat_session', method: 'GET' },
  });

  const getTopicsAndChatSession = (userId) =>
    apiCalls.getTopicsAndChatSession({ userId });

  return { getTopicsAndChatSession, isLoading, error };
};
