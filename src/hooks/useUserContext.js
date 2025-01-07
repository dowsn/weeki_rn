import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export const useUserContext = () => {
     console.log('useUserContext called');

  const context = useContext(UserContext);
       console.log('context value:', context);

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
