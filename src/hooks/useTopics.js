import { useApiCall } from 'src/utils/hook';

export const useTopics = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    getTopics: { path: 'topics', method: 'GET' },
  });

  const getTopics = () =>
    apiCalls.getTopics();

  return { getTopics, isLoading, error };
};
