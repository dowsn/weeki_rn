import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { UserContext, UserProvider } from 'src/contexts/UserContext';
import Tabs from 'src/navigation/Tabs';
import LoginScreen from 'src/screens/LoginRegister/LoginScreen';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator>
      {user.userId === '0' ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
          headerShown: true,
          headerTitle: "Sign In / Sign Up"
          }}
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
