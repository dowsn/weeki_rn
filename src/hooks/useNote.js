import { useApiCall } from 'src/utils/hook';

export const useNote = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    // saveNote: { path: 'save_note', method: 'POST' },
    chat: { path: 'chat', method: 'POST' },
  });

  // const saveNote = (userId, text) => apiCalls.saveNote({ userId, text });

  const chat = (userId, history, query, topics) =>
    apiCalls.suggestQuestion({ userId, history, query, topics });

  return { chat, isLoading, error };
};
