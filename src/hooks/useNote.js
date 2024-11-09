import { useApiCall } from 'src/utils/hook';

export const useNote = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    saveNote: { path: 'save_note', method: 'POST' },
    suggestQuestion: { path: 'suggest_question', method: 'POST' },
  });

  const saveNote = (userId, text) => apiCalls.saveNote({ userId, text });

  const suggestQuestion = (userId, text) =>
    apiCalls.suggestQuestion({ userId, text });

  return { saveNote, suggestQuestion, isLoading, error };
};
