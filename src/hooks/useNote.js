import { useApiCall } from 'src/utils/hook';

export const useNote = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    saveNote: { path: 'save_note', method: 'POST' },
  });

  const saveNote = (userId, text) => apiCalls.saveNote({ userId, text });

  return { saveNote, isLoading, error };
};
