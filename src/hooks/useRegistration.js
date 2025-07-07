import { useApiCall } from 'src/utils/hook';

export const useRegistration = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    register: { path: 'register', method: 'POST', authenticationRequired: false },
  });

  const register = async (username, password, email, reminder) => {
    try {
      console.log('🔍 REGISTRATION: Starting registration with params:', { username, email, reminder });
      const response = await apiCalls.register({
        username,
        password,
        email,
        reminder
      });

      console.log('🔍 REGISTRATION: API response received:', response);
      console.log('🔍 REGISTRATION: response.content:', response.content);

      if (response.content) {
        console.log('✅ REGISTRATION: Success! Returning response with content:', response.content);
        return response
      }

      console.log('❌ REGISTRATION: No content in response, throwing error');
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('❌ REGISTRATION: Error occurred:', error);
      // Preserve and throw the original error message
      throw error;
    }
  };

  return { register, isLoading, error };
};
