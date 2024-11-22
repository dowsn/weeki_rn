// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import Tabs from 'src/navigation/Tabs';
import EditProfileView from 'src/screens/Reflect/EditProfileView';
import AuthStack from 'src/stacks/AuthStack';

const Stack = createStackNavigator();

// Create a wrapper component for protected routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <WeekiLoading />;
  }

  return user.tokens?.access ? children : <AuthStack />;
};

// Create separate screen components with navigation props
const ProtectedTabs = ({ navigation }) => (
  <ProtectedRoute>
    <Tabs navigation={navigation} />
  </ProtectedRoute>
);

const ProtectedEditProfile = ({ navigation, route }) => (
  <ProtectedRoute>
    <EditProfileView navigation={navigation} route={route} />
  </ProtectedRoute>
);

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={ProtectedTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileView"
        component={ProtectedEditProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { user, loading } = useUserContext();

  if (loading) {
    return <WeekiLoading />;
  }

  return user.userId !== 0 ? <MainStack /> : <AuthStack />;
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
