import { useApiCall } from 'src/utils/hook';

export const useOldSession = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    get: { path: 'chat_sessions', method: 'GET' },
  });



  const get = (selectedId) =>
    apiCalls.get({ selectedId, context: true });

  const filter = (selectedId) =>
    apiCalls.get({ selectedId, context: false });


  return { get, filter, error };
};
