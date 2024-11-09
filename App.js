import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import WeekiLoading from 'src/components/common/WeekiLoading';
import { UserProvider } from 'src/contexts/UserContext';
import { useUserContext } from 'src/hooks/useUserContext';
import Tabs from 'src/navigation/Tabs';
import EditProfileView from 'src/screens/Reflect/EditProfileView';
import AuthStack from 'src/stacks/AuthStack';

const Stack = createStackNavigator();

// Create a wrapper component for the main app flow
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfileView"
        component={EditProfileView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { user, setUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser({ userId: 0 });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [setUser]);

  if (isLoading) {
    return <WeekiLoading />;
  }

  // Return MainStack instead of Tabs directly
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
