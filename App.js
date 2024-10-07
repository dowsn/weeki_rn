import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import Tabs from 'src/navigation/Tabs';
import AuthStack from 'src/stacks/AuthStack';
import { usePersistedState } from 'src/utilities/context';

const MainNavigator = ({ user }) => {
  if (user.userId === '0' || user.userId === '1') {
    return <AuthStack />;
  } else {
    return <Tabs />;
  }
};

const App = () => {
  const [user, setUser, isLoading] = usePersistedState('user', { userId: '0' });

  if (isLoading) {
    return <WeekiLoading />;
  }

  return (
    <UserProvider initialUser={user} setUser={setUser}>
      <NavigationContainer>
        <MainNavigator user={user} />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
