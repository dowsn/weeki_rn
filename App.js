import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import Tabs from 'src/navigation/Tabs';
import AuthStack from 'src/stacks/AuthStack';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user } = useUserContext();

  return (
    <Stack.Navigator>
      {user.userId == '0' || user.userId == '1' ? (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Main"
          component={Tabs}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
