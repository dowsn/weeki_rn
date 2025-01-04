import { useApiCall } from 'src/utils/hook';

export const useDashboard = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    getDashboard: { path: 'dashboard', method: 'GET' },
  });

  const getDashboard = () =>
    apiCalls.getDashboard();

  return { getDashboard, isLoading, error };
};
