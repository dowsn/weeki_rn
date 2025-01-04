import { useApiCall } from 'src/utils/hook';
import { useUserContext } from './useUserContext';

export const useUpdateProfile = () => {
  const { apiCalls, isLoading, error } = useApiCall({
    updateProfile: { path: 'update_profile', method: 'POST' },
    deleteProfile: { path: 'delete_profile', method: 'POST' },
  });

  const updateProfile = async (username, email, emailReminders, password) => {

    try {
      const response = await apiCalls.updateProfile({
        username,
        email,
        reminder: emailReminders,
        password,
      });


      if (response.content) {
        return response;
      }


      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Weeki', error);
      // Preserve and throw the original error message
      throw error;
    }
  };

  const deleteProfile = async (password) => {
    try {
      const response = await apiCalls.deleteProfile({ password });

      if (response.content) {
        return response;
      }


      throw new Error(response.message || 'Delete profile failed');
    } catch (error) {
      console.error('Weeki', error);
      // Preserve and throw the original error message
      throw error;
    }
  }


  return { updateProfile, deleteProfile, isLoading, error };
};